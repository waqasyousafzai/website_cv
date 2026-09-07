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
	CountStat,
	RUN_LOG,
	RUNS,
	type RunRecord,
	TICKER,
	useLiveSeries,
} from "./live";

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
			className={cn(
				"flex cursor-pointer flex-col gap-s-3 border bg-card px-s-6 py-s-5 text-left transition-hover",
				active ? "border-signal shadow-glow" : "border-hair",
			)}
			onClick={onClick}
			type="button"
		>
			<span className="flex items-center gap-s-5">
				<span className="font-data text-strong uppercase tracking-label">
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
				<div className="grid grid-cols-1 items-start gap-s-7 p-s-6 row:p-s-7 split:grid-cols-[minmax(0,1fr)_320px] split:gap-s-8 console:p-s-8">
					<div className="flex min-w-0 flex-col gap-s-8">
						<SectionHeader
							index="REC"
							note={`run ${run.id} · ${run.when}`}
							title="Run replay"
						/>
						<VideoPanel
							autoPlay
							caption={`full refresh · ${run.stages} stages · ${run.elapsed} · generated placeholder capture`}
							duration={run.elapsed.slice(0, 5)}
							emptyHint="drop a screen recording of the run in public/media/ and pass it as src"
							emptyLabel="no capture attached"
							height={268}
							label={`run ${run.id} / screen capture`}
							notched
							src="/media/run-4193.webm"
						/>
						<div className="flex flex-col gap-s-6">
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
									<Sparkline fill height={96} values={thrpt} />
								) : (
									<Sparkline
										color="var(--signal-warn)"
										draw
										height={96}
										values={dur}
									/>
								)}
								<div className="mt-s-5 flex justify-between font-data text-dim text-micro">
									<span>{tab === "throughput" ? "−52 min" : "run 4170"}</span>
									<span>{tab === "throughput" ? "now" : "run 4193"}</span>
								</div>
							</Card>
						</div>
						{/* Size columns to the space left beside history, keeping the
						    longest value (99.98%) readable even at the split breakpoint. */}
						<div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,160px),1fr))] gap-s-5">
							<CountStat
								delta="+18% qoq"
								label="Rows / day"
								unit="B"
								value="1.2"
							/>
							<CountStat label="On-time delivery" unit="%" value="99.98" />
							<CountStat label="Pipelines owned" value="41" />
							<CountStat label="Years" value="6" />
						</div>
					</div>
					<div className="flex min-w-0 flex-col gap-s-6">
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
						<LogStream height={148} lines={logs} />
						{/* A real link, so the request survives a middle-click, a copied
						    URL and the back button — the pipeline route validates and then
						    consumes `run` itself. `asChild` drops `leading`, so the icon
						    moves inside. */}
						<Button asChild block size="sm" variant="secondary">
							<Link search={{ run: true }} to="/pipeline">
								<Icon name="rotate-ccw" size={12} />
								Re-run this dag
							</Link>
						</Button>
					</div>
				</div>
			</div>
			<MetricTicker items={TICKER} />
		</div>
	);
}
