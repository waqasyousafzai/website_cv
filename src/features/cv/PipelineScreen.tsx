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
/** Matches `.ds-callout`'s own width; the box shrinks below it, never above. */
const CALLOUT_MAX_W = 300;
const CALLOUT_MIN_W = 200;
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
 * Places the callout beside its node without letting it leave the canvas: it
 * narrows to fit, flips to the node's left when there is no room on the right,
 * and is clamped against the visible viewport rather than the node's own
 * coordinates.
 */
function calloutBox(node: { x: number; y: number }, vp: GraphViewport) {
	// The node's position as the eye sees it. The DAG scrolls in both axes and —
	// once fit-to-view lands — scales, while the overlay does neither, so both
	// have to be undone here.
	const vx = node.x * vp.scale - vp.scrollLeft;
	const vy = node.y * vp.scale - vp.scrollTop;
	const nodeW = NODE_W * vp.scale;

	// Width comes first: on a phone-width canvas the box is narrower than the
	// design's 300px, and every horizontal clamp below depends on knowing that.
	const width = Math.max(
		CALLOUT_MIN_W,
		Math.min(CALLOUT_MAX_W, vp.width - EDGE * 2),
	);
	const side = vx + nodeW + STUB + width + EDGE > vp.width ? "left" : "right";
	const raw = side === "right" ? vx + nodeW + STUB : vx - width - STUB;
	const left = Math.max(EDGE, Math.min(raw, vp.width - width - EDGE));

	// `want` is only the height reserved when clamping `top`, so a callout near
	// the foot of the canvas still has somewhere to sit. The cap itself stays the
	// space actually left below it — the box is content-sized under that.
	const want = Math.min(248, Math.max(0, vp.height - EDGE * 2));
	const top = Math.max(EDGE, Math.min(vy - EDGE, vp.height - want - EDGE));
	const maxHeight = Math.max(0, vp.height - top - EDGE * 2);
	return { side, left, top, width, maxHeight } as const;
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
	const [vp, setVp] = useState<GraphViewport>({
		width: 520,
		height: 280,
		scrollLeft: 0,
		scrollTop: 0,
		scale: 1,
	});
	const timer = useRef<number | undefined>(undefined);
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

	useEffect(() => {
		if (state !== "running" || step < 0) return;
		if (step >= RUN_ORDER.length) {
			setState("ok");
			push({
				status: "ok",
				title: "Run complete",
				message: "7 stages · 00:11.6 elapsed",
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
		<div className="flex min-h-0 flex-1 flex-col overflow-y-auto split:flex-row split:overflow-hidden">
			<div className="flex min-w-0 flex-none flex-col split:min-h-0 split:flex-1">
				<div className="flex flex-wrap items-center gap-s-5 border-hair border-b px-s-5 py-s-5 row:flex-nowrap console:px-s-7">
					<Button
						disabled={state === "running"}
						leading={
							<Icon name={state === "running" ? "loader" : "play"} size={12} />
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
					<div className="ml-auto flex items-center gap-s-5 console:gap-s-7">
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
				<div className="relative h-[320px] flex-none split:h-auto split:min-h-0 split:flex-1">
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
										onClick={() => setTab("stage")}
										size="sm"
										variant="secondary"
									>
										Open in inspector
									</Button>
								}
								duration={status[openNode.id] === "idle" ? "—" : "1.4s"}
								kind={openNode.kind}
								onClose={() => setOpenId(null)}
								rows={
									status[openNode.id] === "idle"
										? "not built"
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
									width: box.width,
									maxHeight: box.maxHeight,
									// On short canvases the fixed header and footer alone can
									// exceed the cap. Scroll the entire panel in that case.
									display: box.maxHeight < 200 ? "block" : undefined,
									overflowY: box.maxHeight < 200 ? "auto" : undefined,
								}}
								title={openNode.label}
							>
								<div className="mb-s-5 font-data text-lime-500 uppercase tracking-label">
									{OUTPUT[openNode.id].head}
								</div>
								<div className="flex flex-col gap-s-4">
									{OUTPUT[openNode.id].lines.map(([k, v]) => (
										<div
											className="flex gap-s-5 font-body-mono text-meta"
											key={k}
										>
											<span className="w-[88px] flex-none text-dim">{k}</span>
											<span className="min-w-0 text-ink-1">{v}</span>
										</div>
									))}
								</div>
							</NodeCallout>
						)}
					</PipelineGraph>
				</div>
				<div className="flex-none border-hair border-t bg-void-0">
					<LogStream
						className="max-w-full border-0"
						height={104}
						lines={tail ? lines : lines.slice(0, 1)}
					/>
				</div>
				<RunStatusBar
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
				<MetricTicker items={TICKER} />
			</div>
			<div className="flex w-full flex-none flex-col border-hair border-t bg-panel split:min-h-0 split:w-inspector split:border-t-0 split:border-l">
				<div className="px-s-5 pt-s-5 console:px-s-7">
					<Tabs
						items={[
							{ id: "stage", label: "Stage" },
							{ id: "schema", label: "Schema" },
						]}
						onChange={setTab}
						value={tab}
					/>
				</div>
				<div className="p-s-6 split:min-h-0 split:flex-1 split:overflow-auto console:p-s-7">
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
