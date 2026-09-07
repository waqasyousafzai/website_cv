import {
	type HTMLAttributes,
	type ReactNode,
	useCallback,
	useEffect,
	useRef,
} from "react";
import { cn } from "@/lib/utils";
import type { IconName } from "./Icon";
import { PipelineNode } from "./PipelineNode";
import type { NodeStatus } from "./types";

export interface GraphNode {
	id: string;
	label: string;
	kind?: string;
	icon?: IconName;
	status?: NodeStatus;
	rows?: string;
	duration?: string;
	/** Absolute position inside the graph canvas, px. */
	x: number;
	y: number;
}

export interface GraphEdge {
	from: string;
	to: string;
	/** Animated flowing dash. */
	live?: boolean;
}

/** Visible canvas metrics — clamp overlay positions against these, never against node coordinates. */
export interface GraphViewport {
	width: number;
	height: number;
	scrollLeft: number;
	scrollTop: number;
	/**
	 * Canvas zoom. Fixed at 1 until fit-to-view lands; it is reported anyway so
	 * overlay maths can be written in scaled coordinates from the start.
	 */
	scale: number;
}

/** DAG canvas: gridded background, bezier edges, absolutely positioned stage nodes. */
// `onSelect` shadows the DOM select event; here it reports the chosen node id.
export interface PipelineGraphProps
	extends Omit<HTMLAttributes<HTMLDivElement>, "onSelect"> {
	nodes: GraphNode[];
	edges: GraphEdge[];
	selectedId?: string;
	onSelect?: (id: string) => void;
	/** @default 176 */
	nodeWidth?: number;
	/** @default 72 */
	nodeHeight?: number;
	/** Canvas height. @default 320 */
	height?: number | string;
	/** Fires on mount, resize and scroll with the visible canvas metrics. */
	onViewport?: (m: GraphViewport) => void;
	/** Overlay layer pinned to the visible canvas (does not scroll with the DAG). */
	children?: ReactNode;
}

export function PipelineGraph({
	nodes = [],
	edges = [],
	selectedId,
	onSelect,
	nodeWidth = 176,
	nodeHeight = 72,
	height = 320,
	onViewport,
	children,
	className,
	style,
	...rest
}: PipelineGraphProps) {
	const byId = new Map(nodes.map((n) => [n.id, n]));
	const path = (a: GraphNode, b: GraphNode) => {
		const x1 = a.x + nodeWidth;
		const y1 = a.y + nodeHeight / 2;
		const x2 = b.x;
		const y2 = b.y + nodeHeight / 2;
		const mx = (x1 + x2) / 2;
		return `M${x1} ${y1} C${mx} ${y1} ${mx} ${y2} ${x2} ${y2}`;
	};
	// The canvas is sized to the DAG in both axes, so overflow — and therefore
	// scrolling — is deliberate rather than a side effect of where the
	// absolutely positioned nodes happen to land.
	const extent = Math.max(...nodes.map((n) => n.x + nodeWidth), 0) + 24;
	const depth = Math.max(...nodes.map((n) => n.y + nodeHeight), 0) + 24;
	const scroller = useRef<HTMLDivElement>(null);
	const report = useCallback(() => {
		const el = scroller.current;
		if (el && onViewport)
			onViewport({
				width: el.clientWidth,
				height: el.clientHeight,
				scrollLeft: el.scrollLeft,
				scrollTop: el.scrollTop,
				scale: 1,
			});
	}, [onViewport]);

	// The scroll-into-view effect must fire on selection alone — `byId`, `extent`
	// and `depth` are rebuilt on every status tick, and listing them as deps would
	// re-snap the canvas mid-run. A ref keeps them current without re-running.
	const latest = useRef({ byId, extent, depth, report });
	latest.current = { byId, extent, depth, report };

	useEffect(() => {
		const el = scroller.current;
		if (!el) return;
		report();
		const ro = new ResizeObserver(report);
		ro.observe(el);
		el.addEventListener("scroll", report);
		return () => {
			ro.disconnect();
			el.removeEventListener("scroll", report);
		};
	}, [report]);

	useEffect(() => {
		const el = scroller.current;
		const { byId: map, extent: ext, depth: dep, report: send } = latest.current;
		const n = selectedId ? map.get(selectedId) : undefined;
		if (!el || !n) return;
		// Both axes: on a short canvas the running stage can be below the fold,
		// and an overlay pinned to it has to follow the node into view.
		const wantX = Math.max(0, Math.min(n.x - 24, ext - el.clientWidth));
		const wantY = Math.max(0, Math.min(n.y - 24, dep - el.clientHeight));
		const moved =
			Math.abs(el.scrollLeft - wantX) > 1 || Math.abs(el.scrollTop - wantY) > 1;
		if (moved) el.scrollTo({ left: wantX, top: wantY });
		else send();
	}, [selectedId]);

	return (
		<div
			className={cn("ds-graph-frame", className)}
			style={{ height, ...style }}
			{...rest}
		>
			<div className="ds-graph" ref={scroller}>
				<div
					className="ds-graph__inner"
					style={{ minWidth: extent, minHeight: depth }}
				>
					<svg
						aria-hidden="true"
						className="ds-graph__edges"
						style={{ width: extent }}
					>
						{edges.map((e) => {
							const a = byId.get(e.from);
							const b = byId.get(e.to);
							if (!a || !b) return null;
							return (
								<path
									className={cn(
										"ds-graph__edge",
										e.live && "ds-graph__edge--live",
									)}
									d={path(a, b)}
									key={`${e.from}->${e.to}`}
								/>
							);
						})}
					</svg>
					{nodes.map((n) => (
						<PipelineNode
							{...n}
							key={n.id}
							onClick={() => onSelect?.(n.id)}
							selected={n.id === selectedId}
							style={{
								position: "absolute",
								left: n.x,
								top: n.y,
								width: nodeWidth,
								minHeight: nodeHeight,
							}}
						/>
					))}
				</div>
			</div>
			{children && <div className="ds-graph__overlay">{children}</div>}
		</div>
	);
}
