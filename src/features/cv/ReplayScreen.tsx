import { Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
	Badge,
	Card,
	Icon,
	type LogLine,
	LogStream,
	MetricTicker,
	SectionHeader,
	Sparkline,
	VideoPanel,
} from "@/components/design";
import { Button } from "@/components/ui/button";
import { Tabs } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import {
	CvStats,
	RUN_LOG,
	RUNS,
	type RunRecord,
	TICKER,
	useLiveSeries,
} from "./live";

/** The longest line of the replay header's note, in characters of its monospace face. */
const NOTE_CH = Math.max(
	...RUNS.flatMap((r) => [`run ${r.id} · ${r.when}`.length, r.note.length]),
);

function RunRow({
	run,
	active,
	onClick,
}: {
	run: RunRecord;
	active: boolean;
	onClick: () => void;
}) {
	return (
		<button
			// A pressed toggle, the same way a pipeline node reports its selection:
			// the row picks which run the transcript and the stats below describe.
			aria-pressed={active}
			className={cn(
				"flex cursor-pointer flex-col gap-s-3 border bg-card px-s-6 py-s-5 text-left transition-hover",
				active ? "border-signal shadow-glow" : "border-hair",
			)}
			onClick={onClick}
			type="button"
		>
			<span className="flex items-center gap-s-5">
				<span className="font-data text-strong uppercase tracking-label">
					{/* Selection is a gold border and a glow — both hue. The caret is
					    the cue that survives without it. A reserved-width box keeps the
					    row from shifting sideways as the selection moves. */}
					<span
						aria-hidden="true"
						className={cn(
							"inline-block w-[13px] text-signal-primary",
							!active && "opacity-0",
						)}
					>
						▸
					</span>
					run {run.id}
				</span>
				<span className="ml-auto">
					<Badge status={run.state}>{run.state}</Badge>
				</span>
			</span>
			<span className="flex gap-s-5 font-data text-dim text-micro">
				<span>{run.when}</span>
				<span>·</span>
				<span>{run.elapsed}</span>
				<span>·</span>
				<span>{run.stages}</span>
			</span>
			<span className="font-body-mono text-micro text-muted">{run.note}</span>
		</button>
	);
}

export function ReplayScreen() {
	const [id, setId] = useState("4193");
	const [tab, setTab] = useState("throughput");
	const run = RUNS.find((r) => r.id === id) ?? RUNS[0];
	const thrpt = useLiveSeries(52, 760);
	const dur = useMemo(
		() =>
			Array.from(
				{ length: 24 },
				(_, i) => 10.5 + Math.sin(i / 1.7) * 1.6 + (i === 19 ? 3.4 : 0),
			),
		[],
	);
	const logs: LogLine[] = RUN_LOG[run.id].map(([level, msg], i) => ({
		ts: `00:0${i}.00${i}`,
		level,
		msg,
	}));

	return (
		<div className="flex min-h-0 flex-1 flex-col">
			<div
				className="min-h-0 flex-1 overflow-auto bg-void-0"
				style={{ backgroundImage: "var(--grid-coarse)" }}
			>
				<div className="grid grid-cols-1 items-start gap-(--stack-loose) p-s-6 row:p-s-7 split:grid-cols-[minmax(0,1fr)_var(--inspector-w)] split:gap-s-8 console:p-s-8">
					{/* Both columns keep one 16px block rhythm (the history column's), which
					    also lets the replay end with its padding in view at 900px tall. */}
					<div className="flex min-w-0 flex-col gap-s-6">
						<SectionHeader
							// A narrow column puts the note on its own line under the title
							// instead of wrapping both.
							className="flex-wrap"
							index="REC"
							note={
								// The run's identity over its outcome. Every line of every run
								// fits the block's fixed width, so which run is selected never
								// changes where the header wraps or how tall it is.
								<span
									className="flex flex-col items-end"
									style={{ minWidth: `${NOTE_CH}ch` }}
								>
									<span>
										run {run.id} · {run.when}
									</span>
									<span>{run.note}</span>
								</span>
							}
							title="Run replay"
						/>
						<VideoPanel
							autoPlay
							// Only fixed-width figures, so the caption wraps the same way for
							// every run; the variable outcome note sits in the header.
							caption={`${run.stages} stages · ${run.elapsed} · generated placeholder capture`}
							duration={run.elapsed.slice(0, 5)}
							emptyHint="drop a screen recording of the run in public/media/ and pass it as src"
							emptyLabel="no capture attached"
							height={268}
							label={`run ${run.id} / screen capture`}
							notched
							src="/media/run-4193.webm"
						/>
						{/* The tabs sit close over the card they switch. */}
						<div className="flex flex-col gap-s-4">
							<Tabs
								aria-label="Replay metrics"
								items={[
									{ id: "throughput", label: "Throughput" },
									{ id: "duration", label: "Run duration" },
								]}
								onChange={setTab}
								value={tab}
							/>
							<Card
								title={
									tab === "throughput"
										? "rows / minute · live"
										: "run duration · last 24 runs"
								}
							>
								{tab === "throughput" ? (
									<Sparkline
										fill
										grid={3}
										height={96}
										label="Rows per minute, live"
										values={thrpt}
									/>
								) : (
									<Sparkline
										color="var(--signal-warn)"
										draw
										grid={3}
										height={96}
										label="Run duration, last 24 runs"
										unit="seconds"
										values={dur}
									/>
								)}
								<div className="mt-s-5 flex justify-between font-data text-dim text-micro">
									<span>{tab === "throughput" ? "−52 min" : "run 4170"}</span>
									<span>{tab === "throughput" ? "now" : "run 4193"}</span>
								</div>
							</Card>
						</div>
						{/* The CV's own figures. They used to be four hand-written cards
						    that the CV does not support. The CV holds one statistic, so
						    it is kept to the secondary column's width rather than
						    stretched across the main one. */}
						<div className="max-w-inspector">
							<CvStats />
						</div>
					</div>
					<div
						// A hairline and a loose stack step set history apart from the
						// replay: above it when stacked, beside it when split, where the
						// column stretches so the rule runs the replay's full height.
						className="flex min-w-0 flex-col gap-s-6 border-hair border-t pt-(--stack-loose) split:self-stretch split:border-t-0 split:border-l split:pt-s-0 split:pl-s-8"
					>
						<SectionHeader
							index="LOG"
							note={`${RUNS.length} runs`}
							title="History"
						/>
						<div className="flex flex-col gap-s-4">
							{RUNS.map((r) => (
								<RunRow
									active={r.id === id}
									key={r.id}
									onClick={() => setId(r.id)}
									run={r}
								/>
							))}
						</div>
						<LogStream
							label={`Run ${run.id} transcript`}
							// Measured for the longest transcript (run 4193), whose lines
							// wrap in a narrow column: 250px holds it from a 351px viewport,
							// 124px in the full-width column from 540px, and 178px in the
							// split column's 315px content width. The `height` prop's inline
							// px would beat these classes, so it is cleared.
							className="h-[250px] row:h-[124px] split:h-[178px]"
							lines={logs}
							style={{ height: undefined }}
						/>
						{/* A real link, so the request survives a middle-click, a copied
						    URL and the back button — the pipeline route validates and then
						    consumes `run` itself. `asChild` drops `leading`, so the icon
						    moves inside. A hairline sets the action apart from the log. */}
						<div className="border-hair border-t pt-s-6">
							<Button asChild block size="sm" variant="secondary">
								<Link search={{ run: true }} to="/pipeline">
									<Icon name="rotate-ccw" size={12} />
									Re-run this dag
								</Link>
							</Button>
						</div>
					</div>
				</div>
			</div>
			<MetricTicker items={TICKER} />
		</div>
	);
}
