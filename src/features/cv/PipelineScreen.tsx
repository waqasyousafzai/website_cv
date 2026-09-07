import { useEffect, useId, useRef, useState } from "react";
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

const STAGE_MS = 1000;
const CALLOUT_W = 300;
const NODE_W = 176;

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
 * flips to the node's left when there is no room on the right, and is clamped
 * against the visible viewport rather than the node's own coordinates.
 */
function calloutBox(node: { x: number; y: number }, vp: GraphViewport) {
	const vx = node.x - vp.scrollLeft;
	const side = vx + NODE_W + 16 + CALLOUT_W + 8 > vp.width ? "left" : "right";
	const raw = side === "right" ? vx + NODE_W + 16 : vx - CALLOUT_W - 16;
	const left = Math.max(8, Math.min(raw, vp.width - CALLOUT_W - 8));
	const want = Math.min(248, Math.max(120, vp.height - 16));
	const top = Math.max(
		8,
		Math.min(node.y - 8, Math.max(8, vp.height - want - 8)),
	);
	return {
		side,
		left,
		top,
		maxHeight: Math.max(120, vp.height - top - 16),
	} as const;
}

export function PipelineScreen() {
	const push = useToast();
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
	const [vp, setVp] = useState<GraphViewport>({
		width: 520,
		height: 280,
		scrollLeft: 0,
		scrollTop: 0,
	});
	const timer = useRef<number | undefined>(undefined);
	const tailId = useId();

	const run = () => {
		setStatus(idle());
		setLines([
			{ ts: "00:00.004", level: "info", msg: "dag run started · full refresh" },
		]);
		setState("running");
		setStep(0);
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
		<div className="flex min-h-0 flex-1">
			<div className="flex min-w-0 flex-1 flex-col">
				<div className="flex items-center gap-s-5 border-hair border-b px-s-7 py-s-5">
					<Button
						disabled={state === "running"}
						leading={
							<Icon name={state === "running" ? "loader" : "play"} size={12} />
						}
						onClick={run}
						size="sm"
					>
						{state === "running" ? "Running" : "Run pipeline"}
					</Button>
					<Button
						leading={<Icon name="download" size={12} />}
						size="sm"
						variant="secondary"
					>
						Download CV
					</Button>
					<div className="ml-auto flex items-center gap-s-7">
						<Switch
							checked={tail}
							id={tailId}
							label="Live tail"
							onCheckedChange={setTail}
						/>
						<Tooltip content="Fit to view">
							<IconButton bordered label="Fit">
								<Icon name="maximize" size={14} />
							</IconButton>
						</Tooltip>
					</div>
				</div>
				<div className="relative min-h-0 flex-1">
					<PipelineGraph
						edges={edges}
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
								style={{
									left: box.left,
									top: box.top,
									maxHeight: box.maxHeight,
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
											<span className="text-ink-1">{v}</span>
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
							<Badge status="idle">analytics_wh · XS</Badge>
							<Badge status={state === "ok" ? "ok" : "idle"}>prod</Badge>
						</>
					}
					stage={node.label}
					state={state}
				/>
				<MetricTicker items={TICKER} />
			</div>
			<div className="flex min-h-0 w-inspector flex-none flex-col border-hair border-l bg-panel">
				<div className="px-s-7 pt-s-5">
					<Tabs
						items={[
							{ id: "stage", label: "Stage" },
							{ id: "schema", label: "Schema" },
						]}
						onChange={setTab}
						value={tab}
					/>
				</div>
				<div className="flex-1 overflow-auto p-s-7">
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
