import {
	type HTMLAttributes,
	type ReactNode,
	useCallback,
	useEffect,
	useRef,
	useState,
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
	 * Canvas zoom: 1 at actual size, below 1 while `fit` is on. Overlays are drawn
	 * unscaled, so anything pinned to a node has to multiply through this.
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
	/**
	 * Scales the whole DAG down until it fits the visible canvas, and stops it
	 * scrolling. Never magnifies: a canvas roomier than the graph is unchanged.
	 * @default false
	 */
	fit?: boolean;
	/** Fires on mount, resize, scroll and zoom with the visible canvas metrics. */
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
	fit = false,
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
	const [size, setSize] = useState({ w: 0, h: 0 });

	// Both axes have to fit, and 1 is the ceiling: fit is a way of seeing the
	// whole DAG, not a zoom control.
	const scale =
		fit && size.w > 0 && size.h > 0
			? Math.min(1, size.w / extent, size.h / depth)
			: 1;
	// `report` is rebuilt when the zoom changes, which re-runs the listener effect
	// below and republishes the viewport: a new scale is a viewport change like
	// any other, and overlays position themselves in scaled coordinates.
	const report = useCallback(() => {
		const el = scroller.current;
		if (!el) return;
		setSize((s) =>
			s.w === el.clientWidth && s.h === el.clientHeight
				? s
				: { w: el.clientWidth, h: el.clientHeight },
		);
		onViewport?.({
			width: el.clientWidth,
			height: el.clientHeight,
			scrollLeft: el.scrollLeft,
			scrollTop: el.scrollTop,
			scale,
		});
	}, [onViewport, scale]);

	// The scroll-into-view effect must fire on selection alone — `byId`, `extent`
	// and `depth` are rebuilt on every status tick, and listing them as deps would
	// re-snap the canvas mid-run. A ref keeps them current without re-running.
	const latest = useRef({ byId, extent, depth, report });
	latest.current = { byId, extent, depth, report };

	// Measuring feeds `scale`, which feeds `report` — so this settles in one extra
	// pass rather than looping: an unchanged size leaves `size` and therefore
	// `report` identical, and the effect does not re-run.
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
		if (!el) return;
		const { byId: map, extent: ext, depth: dep, report: send } = latest.current;
		// Under fit the whole DAG is on screen from the origin, so there is nowhere
		// to scroll to — but a scroll offset from before fit engaged would survive:
		// the inner box keeps its unscaled layout size, and `overflow: hidden`
		// would then leave the user unable to scroll it back. Reset to the origin,
		// whatever is selected, which also gives the overlay the fresh reading it
		// needs to re-anchor.
		if (fit) {
			if (el.scrollLeft || el.scrollTop) el.scrollTo({ left: 0, top: 0 });
			else send();
			return;
		}
		const n = selectedId ? map.get(selectedId) : undefined;
		if (!n) return;
		// Both axes: on a short canvas the running stage can be below the fold,
		// and an overlay pinned to it has to follow the node into view.
		const wantX = Math.max(0, Math.min(n.x - 24, ext - el.clientWidth));
		const wantY = Math.max(0, Math.min(n.y - 24, dep - el.clientHeight));
		const moved =
			Math.abs(el.scrollLeft - wantX) > 1 || Math.abs(el.scrollTop - wantY) > 1;
		if (moved) el.scrollTo({ left: wantX, top: wantY });
		else send();
	}, [selectedId, fit]);

	return (
		<div
			className={cn("ds-graph-frame", className)}
			style={{ height, ...style }}
			{...rest}
		>
			<div
				className="ds-graph"
				ref={scroller}
				// Scaling is a transform, so the inner box keeps its full unscaled
				// layout size. Without this the browser would offer scrollbars for a
				// DAG that is visibly complete in frame.
				style={fit ? { overflow: "hidden" } : undefined}
			>
				<div
					className="ds-graph__inner"
					style={{
						minWidth: extent,
						minHeight: depth,
						transform: scale === 1 ? undefined : `scale(${scale})`,
						transformOrigin: "0 0",
						// `--dur-base` collapses to 0ms under prefers-reduced-motion, so
						// the zoom needs no branch of its own.
						transition: "transform var(--dur-base) var(--ease-out)",
					}}
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
