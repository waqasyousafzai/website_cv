import { getRouteApi } from "@tanstack/react-router";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import {
	Badge,
	Card,
	type GraphViewport,
	Icon,
	IconButton,
	type LogLine,
	LogStream,
	MetricTicker,
	NodeCallout,
	PipelineGraph,
	RunStatusBar,
	SchemaTable,
	type Status,
} from "@/components/design";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Tabs } from "@/components/ui/tabs";
import { Tooltip } from "@/components/ui/tooltip";
import { count } from "@/lib/utils";
import { CV_FILENAME, downloadCvText } from "./cv-text";
import {
	CV,
	EDGES,
	LOG_FOR,
	NODES,
	type NodeId,
	OUTPUT,
	ROWS,
	RUN_ORDER,
} from "./data";
import { TICKER } from "./live";
import { PANES } from "./Panes";
import { useToast } from "./toast-context";

// The screen lives outside its route module, so it reaches the route through the
// registry rather than importing `Route` back out of a file that imports it.
const route = getRouteApi("/_app/pipeline");

const STAGE_MS = 1000;
const NODE_W = 176;
/** Rendered height of a stage node: its 72px minimum grown by three text lines. Measured. */
const NODE_H = 85;
/** Matches `.ds-callout`'s own width; the box shrinks below it, never above. */
const CALLOUT_MAX_W = 300;
const CALLOUT_MIN_W = 200;
/** Height kept for a usable callout: header, meta, footer and a few body rows. */
const CALLOUT_WANT_H = 248;
/** Length of the connector stub between node and callout. */
const STUB = 16;
/** Breathing room kept between the callout and the canvas edge. */
const EDGE = 8;

const pad2 = (n: number) => String(n).padStart(2, "0");
const fmt = (s: number) =>
	`00:${pad2(Math.floor(s))}.${String(Math.round((s % 1) * 1000)).padStart(3, "0")}`;

const idle = () =>
	Object.fromEntries(NODES.map((n) => [n.id, "idle"])) as Record<
		NodeId,
		Status
	>;

/**
 * Places the callout without letting it leave the canvas or cover its own node:
 * beside the node when a flank has room (right first, then left), otherwise
 * below or above it. It narrows to fit, and is clamped against the visible
 * viewport rather than the node's own coordinates.
 */
function calloutBox(node: { x: number; y: number }, vp: GraphViewport) {
	// The node's position as the eye sees it. The DAG scrolls in both axes and —
	// once fit-to-view lands — scales, while the overlay does neither, so both
	// have to be undone here.
	const vx = node.x * vp.scale - vp.scrollLeft;
	const vy = node.y * vp.scale - vp.scrollTop;
	const nodeW = NODE_W * vp.scale;
	const nodeH = NODE_H * vp.scale;

	// Width comes first: on a phone-width canvas the box is narrower than the
	// design's 300px, and every horizontal clamp below depends on knowing that.
	const width = Math.max(
		CALLOUT_MIN_W,
		Math.min(CALLOUT_MAX_W, vp.width - EDGE * 2),
	);
	const clampLeft = (x: number, w: number) =>
		Math.max(EDGE, Math.min(x, vp.width - w - EDGE));

	const rightX = vx + nodeW + STUB;
	const leftX = vx - STUB - width;
	const rightFits = rightX + width + EDGE <= vp.width;
	if (rightFits || leftX >= EDGE) {
		// `want` is only the height reserved when clamping `top`, so a callout near
		// the foot of the canvas still has somewhere to sit. The cap itself stays
		// the space actually left below it — the box is content-sized under that.
		const want = Math.min(CALLOUT_WANT_H, Math.max(0, vp.height - EDGE * 2));
		const top = Math.max(EDGE, Math.min(vy - EDGE, vp.height - want - EDGE));
		return {
			side: rightFits ? "right" : "left",
			left: clampLeft(rightFits ? rightX : leftX, width),
			top,
			bottom: undefined,
			width,
			maxHeight: Math.max(0, vp.height - top - EDGE * 2),
		} as const;
	}

	// Neither flank has room — a phone-width canvas, or a stage panned to the
	// middle of a narrow one — so the box sits under or over the node instead,
	// where it can never cover it. It starts at the node's left edge, so the stub
	// (drawn near the box's left edge) lands on the node, and slides left when
	// that would leave the canvas. It keeps its full width: narrower, the title
	// ellipsizes and the meta line, which cannot wrap, is cut off.
	const left = clampLeft(Math.max(EDGE, vx), width);
	const roomBelow = vp.height - (vy + nodeH + STUB) - EDGE;
	const roomAbove = vy - STUB - EDGE;
	if (roomBelow >= CALLOUT_WANT_H || roomBelow >= roomAbove) {
		const top = Math.max(EDGE, Math.min(vy + nodeH + STUB, vp.height - EDGE));
		return {
			side: "bottom",
			left,
			top,
			bottom: undefined,
			width,
			maxHeight: Math.max(0, vp.height - top - EDGE),
		} as const;
	}
	// Above, the box is anchored by its foot: its height is its content's, so
	// only the bottom edge is known. The overlay spans the canvas from its top.
	const foot = Math.max(EDGE, Math.min(vy - STUB, vp.height - EDGE));
	return {
		side: "top",
		left,
		top: undefined,
		bottom: `calc(100% - ${foot}px)`,
		width,
		maxHeight: Math.max(0, foot - EDGE),
	} as const;
}

export function PipelineScreen() {
	const push = useToast();
	const { run: requested } = route.useSearch();
	const navigate = route.useNavigate();
	const [status, setStatus] = useState<Record<NodeId, Status>>(idle);
	const [sel, setSel] = useState<NodeId>("src_profile");
	const [openId, setOpenId] = useState<NodeId | null>("src_profile");
	const [lines, setLines] = useState<LogLine[]>([
		{ ts: "00:00.004", level: "info", msg: "runtime ready — hit run pipeline" },
	]);
	const [state, setState] = useState<Status>("idle");
	const [step, setStep] = useState(-1);
	const [tab, setTab] = useState("stage");
	const [tail, setTail] = useState(true);
	const [fit, setFit] = useState(false);
	const [reveal, setReveal] = useState(0);
	const [vp, setVp] = useState<GraphViewport>({
		width: 520,
		height: 280,
		scrollLeft: 0,
		scrollTop: 0,
		scale: 1,
	});
	const timer = useRef<number | undefined>(undefined);
	const screen = useRef<HTMLDivElement>(null);
	const strip = useRef<HTMLDivElement>(null);
	const inspector = useRef<HTMLDivElement>(null);
	const tailId = useId();

	const start = useCallback(() => {
		setStatus(idle());
		setLines([
			{ ts: "00:00.004", level: "info", msg: "dag run started · full refresh" },
		]);
		setState("running");
		setStep(0);
	}, []);

	// A run asked for through the URL. Consuming it with `replace` the moment
	// execution starts leaves plain `/pipeline` in history, so the flag is spent
	// exactly once: back, forward and a reload all land on a URL that asks for
	// nothing. A fresh request from replay pushes `?run=true` again and re-fires.
	useEffect(() => {
		if (!requested) return;
		start();
		navigate({ replace: true, search: {}, to: "/pipeline" });
	}, [requested, start, navigate]);

	const download = () => {
		const bytes = downloadCvText();
		push({
			status: "ok",
			title: "CV downloaded",
			message: `${CV_FILENAME} · ${(bytes / 1024).toFixed(1)} KB`,
		});
	};

	// The callout hands its stage over to the panel that keeps it: select the node
	// the callout is describing rather than trusting `sel` to already agree, show
	// the pane that renders it, and ask for the panel to be revealed.
	const openInInspector = (id: NodeId) => {
		setSel(id);
		setTab("stage");
		setReveal((n) => n + 1);
	};

	// Keyed on a counter rather than on `tab` or `sel`: the button's most common
	// press changes neither — the Stage tab is already showing that stage — and the
	// reveal still has to happen. Waiting for the commit matters too, since
	// arriving from Schema grows the panel and with it how far the screen can
	// scroll.
	useEffect(() => {
		const el = inspector.current;
		if (!reveal || !el) return;
		// Below `split:` this scrolls the screen's one scroll region down to the
		// stacked panel. At and above it the two columns are height-locked and that
		// region has nothing to scroll, so the same call is a no-op and no media
		// query is needed. `--dur-*` collapsing under reduced motion does not reach
		// programmatic scrolling, so the check is made here. The region's scroll
		// padding (below) stops the panel beneath the pinned action strip.
		el.scrollIntoView({
			behavior: window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
				? "auto"
				: "smooth",
			block: "start",
		});
		// The button the press came from may now be behind the fold, and Tab would
		// otherwise carry on from there. `preventScroll` leaves the scroll above to
		// finish; a mouse press still gets no ring, because `:focus-visible` answers
		// a programmatic focus only after keyboard interaction.
		el.focus({ preventScroll: true });
	}, [reveal]);

	// Below `split:` the action strip is pinned over the top of the scroll region,
	// and neither Tab nor Open in inspector knows it is there: both would scroll
	// their target in under it. Scroll padding the strip's height keeps every
	// scroll-into-view clear of it. The strip is one row or two depending on the
	// width, so the height is measured rather than fixed in a class. At `split:`
	// and above the region has nothing to scroll, so the padding does nothing.
	useEffect(() => {
		const bar = strip.current;
		const region = screen.current;
		if (!bar || !region) return;
		const sync = () => {
			region.style.scrollPaddingTop = `${bar.offsetHeight}px`;
		};
		sync();
		const ro = new ResizeObserver(sync);
		ro.observe(bar);
		return () => ro.disconnect();
	}, []);

	useEffect(() => {
		if (state !== "running" || step < 0) return;
		if (step >= RUN_ORDER.length) {
			setState("ok");
			push({
				status: "ok",
				title: "Run complete",
				message: `${count(RUN_ORDER.length, "stage")} · 00:11.6 elapsed`,
			});
			return;
		}
		const id = RUN_ORDER[step];
		setStatus((s) => ({ ...s, [id]: "running" }));
		setSel(id);
		setOpenId(id);
		const logs = LOG_FOR[id];
		const [firstLevel, firstMsg] = logs[0];
		setLines((l) => [
			...l,
			{ ts: fmt(step * 1.65 + 0.2), level: firstLevel, msg: firstMsg },
		]);
		timer.current = window.setTimeout(() => {
			const [lastLevel, lastMsg] = logs[logs.length - 1];
			setStatus((s) => ({ ...s, [id]: lastLevel === "warn" ? "warn" : "ok" }));
			setLines((l) => [
				...l,
				{ ts: fmt(step * 1.65 + 1.4), level: lastLevel, msg: lastMsg },
			]);
			setStep(step + 1);
		}, STAGE_MS);
		return () => clearTimeout(timer.current);
	}, [state, step, push]);

	const nodes = NODES.map((n) => ({
		...n,
		status: status[n.id],
		rows: status[n.id] === "idle" ? "—" : ROWS[n.id],
		duration: status[n.id] === "idle" ? "—" : "1.4s",
	}));
	const edges = EDGES.map((e) => ({
		...e,
		live: status[e.from] !== "idle" && status[e.to] === "running",
	}));
	const node = NODES.find((n) => n.id === sel) ?? NODES[0];
	const openNode = NODES.find((n) => n.id === openId);
	const box = openNode ? calloutBox(openNode, vp) : null;
	const Pane = PANES[node.pane];
	const progress = Math.min(
		100,
		Math.round((Math.max(0, step) / RUN_ORDER.length) * 100),
	);

	return (
		// Below `split:` the inspector stacks under the graph and the screen
		// becomes one scroll region; at and above it, the console is a locked two
		// column frame again and each pane scrolls on its own.
		<div
			className="flex min-h-0 flex-1 flex-col overflow-y-auto split:flex-row split:overflow-hidden"
			ref={screen}
		>
			{/* Below `split:` this column dissolves into the scroll region, because a
			    sticky element only sticks within its parent: the strip has to stay
			    pinned while the inspector, which is outside this column, scrolls by. */}
			<div className="contents split:flex split:min-h-0 split:min-w-0 split:flex-1 split:flex-col">
				<div
					// Pinned above the graph overlay (z-index 5) while the stacked region
					// scrolls, on the app surface so nothing shows through. The two groups
					// share a row when they fit and wrap otherwise; a wrapped group starts
					// at the left edge instead of squeezing its controls.
					className="sticky top-0 z-10 flex flex-none flex-wrap items-center justify-between gap-x-s-5 gap-y-s-4 border-hair border-b bg-void-0 px-s-5 py-s-4 row:py-s-5 split:static split:z-auto console:px-s-7"
					ref={strip}
				>
					<div className="flex flex-wrap items-center gap-x-s-5 gap-y-s-4">
						<Button
							// The idle label's measured width (135.2px), so "Running" does
							// not pull Download CV to the left.
							className="min-w-[136px]"
							disabled={state === "running"}
							leading={
								<Icon
									name={state === "running" ? "loader" : "play"}
									size={12}
								/>
							}
							onClick={start}
							size="sm"
						>
							{state === "running" ? "Running" : "Run pipeline"}
						</Button>
						<Button
							leading={<Icon name="download" size={12} />}
							onClick={download}
							size="sm"
							variant="secondary"
						>
							Download CV
						</Button>
					</div>
					<div className="flex items-center gap-s-5 console:gap-s-7">
						<Switch
							checked={tail}
							id={tailId}
							label="Live tail"
							onCheckedChange={setTail}
						/>
						<Tooltip content={fit ? "Actual size" : "Fit to view"}>
							<IconButton
								active={fit}
								bordered
								label={fit ? "Actual size" : "Fit to view"}
								onClick={() => setFit((f) => !f)}
							>
								<Icon name={fit ? "minimize" : "maximize"} size={14} />
							</IconButton>
						</Tooltip>
					</div>
				</div>
				<div
					// Stacked, the height is measured for the callout below the lowest
					// stage that still opens downward: stg_education at y 184, an 85px
					// node, the 16px stub, a 248px callout and 8px of edge = 541px of
					// canvas, plus a 9px horizontal scrollbar. Split, the graph takes
					// what the log leaves.
					className="relative h-[550px] flex-none split:h-auto split:min-h-0 split:flex-1"
				>
					<PipelineGraph
						edges={edges}
						fit={fit}
						height="100%"
						nodes={nodes}
						onSelect={(id) => {
							setSel(id as NodeId);
							setOpenId(id as NodeId);
						}}
						onViewport={setVp}
						selectedId={sel}
					>
						{openNode && box && (
							<NodeCallout
								actions={
									<Button
										onClick={() => openInInspector(openNode.id)}
										size="sm"
										variant="secondary"
									>
										Open in inspector
									</Button>
								}
								// Before a run there is no count or timing to report. Say which
								// figure is missing and why, rather than a bare "not built" and a
								// dash; the meta line cannot wrap, so it stays short.
								duration={status[openNode.id] === "idle" ? undefined : "1.4s"}
								kind={openNode.kind}
								onClose={() => setOpenId(null)}
								rows={
									status[openNode.id] === "idle"
										? "rows: not run"
										: ROWS[openNode.id]
								}
								side={box.side}
								status={status[openNode.id]}
								// Inline, because `.ds-callout` is an unlayered design system
								// rule no utility can override — and this box is measured, not
								// a breakpoint away.
								style={{
									left: box.left,
									top: box.top,
									bottom: box.bottom,
									width: box.width,
									maxHeight: box.maxHeight,
									// On short canvases the fixed header and footer alone can
									// exceed the cap. Scroll the entire panel in that case.
									display: box.maxHeight < 200 ? "block" : undefined,
									overflowY: box.maxHeight < 200 ? "auto" : undefined,
								}}
								title={openNode.label}
							>
								<div className="mb-s-5 font-data text-signal-primary uppercase tracking-label">
									{OUTPUT[openNode.id].head}
								</div>
								<div className="flex flex-col gap-s-4">
									{OUTPUT[openNode.id].lines.map(([k, v]) => (
										<div
											className="flex gap-s-5 font-body-mono text-meta"
											key={k}
										>
											<span className="w-[88px] flex-none text-dim">{k}</span>
											{/* An address, a URL or a category's tool list outruns
											    the value column, so it wraps rather than being cut
											    off by the callout's hidden horizontal overflow. */}
											<span className="min-w-0 text-ink-1 wrap-anywhere">
												{v}
											</span>
										</div>
									))}
								</div>
							</NodeCallout>
						)}
					</PipelineGraph>
				</div>
				<div className="flex-none border-hair border-t bg-void-0">
					<LogStream
						label="Pipeline run log"
						// Stacked, the log keeps its original 104px box (four rows) under
						// the taller graph. Split, it grows to six 20px rows, the 18px
						// cursor line, 12px padding and a 1px border each side (164px),
						// which still leaves the canvas the 541px the stacked frame is
						// measured for at 900px tall. The `height` prop's inline px would
						// beat these classes, so it is cleared.
						className="h-[104px] max-w-full border-0 split:h-[164px]"
						lines={tail ? lines : lines.slice(0, 1)}
						style={{ height: undefined }}
					/>
				</div>
				<RunStatusBar
					className="flex-none"
					progress={progress}
					right={
						<>
							{/* The strip clips rather than wraps, so the verbose badge steps
							    aside on a phone. `contents` keeps the badge a runbar flex
							    item — `hidden` on the Badge itself would lose to `.ds-badge`. */}
							<span className="hidden row:contents">
								<Badge status="idle">analytics_wh · XS</Badge>
							</span>
							<Badge status={state === "ok" ? "ok" : "idle"}>prod</Badge>
						</>
					}
					stage={node.label}
					state={state}
				/>
				<MetricTicker className="flex-none" items={TICKER} />
			</div>
			<div
				// Stacked, a band of the app surface sets the panel apart from the
				// output above it.
				className="mt-s-8 flex w-full flex-none flex-col border-hair border-t bg-panel split:mt-s-0 split:min-h-0 split:w-inspector split:border-t-0 split:border-l"
				ref={inspector}
				// A destination for Open in inspector, not a tab stop.
				tabIndex={-1}
			>
				{/* Split, the strip is as tall as the action strip's single row (59px),
				    so the tab rule continues the strip's rule across the console. */}
				<div className="px-s-5 pt-s-5 split:flex split:h-[59px] split:flex-col split:justify-end split:pt-s-0 console:px-s-7">
					<Tabs
						aria-label="Pipeline inspector"
						items={[
							{ id: "stage", label: "Stage" },
							{ id: "schema", label: "Schema" },
						]}
						onChange={setTab}
						value={tab}
					/>
				</div>
				<div className="px-s-5 py-s-6 split:min-h-0 split:flex-1 split:overflow-auto console:p-s-7">
					{tab === "stage" ? (
						<Pane />
					) : (
						<Card padded={false} title={`${node.label} / columns`}>
							<SchemaTable columns={CV.schema} />
						</Card>
					)}
				</div>
			</div>
		</div>
	);
}
