import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";
import type { Status } from "./types";

const DOT: Record<Status, string> = {
	idle: "var(--signal-idle)",
	running: "var(--signal-running)",
	ok: "var(--signal-primary)",
	warn: "var(--signal-warn)",
	fail: "var(--signal-fail)",
};

/** Fixed status strip at the bottom of a pipeline view: state, current stage, progress, counters. */
export interface RunStatusBarProps extends HTMLAttributes<HTMLDivElement> {
	/** @default "idle" */
	state?: Status;
	/** 0-100. @default 0 */
	progress?: number;
	/** Current stage id, e.g. "transform / fct_orders". */
	stage?: ReactNode;
	rows?: ReactNode;
	elapsed?: ReactNode;
	/** Extra right-aligned nodes (env badge, controls). */
	right?: ReactNode;
	/** Names the progress meter for assistive technology. @default "Run progress" */
	progressLabel?: string;
}

export function RunStatusBar({
	state = "idle",
	progress = 0,
	stage,
	rows,
	elapsed,
	right,
	progressLabel = "Run progress",
	className,
	...rest
}: RunStatusBarProps) {
	const pct = Math.max(0, Math.min(100, Math.round(progress)));
	return (
		<div className={cn("ds-runbar", className)} {...rest}>
			<span
				className="flex items-center gap-s-3 tracking-label uppercase"
				style={{ color: DOT[state] }}
			>
				<span className="h-[5px] w-[5px] rounded-full bg-current" />
				{state}
			</span>
			{stage && <span className="ds-runbar__stage text-muted">{stage}</span>}
			{/* The meter is a picture of the figure beside it. Both are here because
			    neither alone survives: the bar is unreadable to a screen reader and
			    the percentage is easy to miss at a glance. */}
			<span
				aria-label={progressLabel}
				aria-valuemax={100}
				aria-valuemin={0}
				aria-valuenow={pct}
				aria-valuetext={`${pct}% — ${state}`}
				className="ds-runbar__meter"
				role="progressbar"
			>
				<span className="ds-runbar__fill" style={{ width: `${pct}%` }} />
			</span>
			<span aria-hidden="true" className="ds-runbar__pct">
				{pct}%
			</span>
			{rows && <span>{rows}</span>}
			{elapsed && <span>{elapsed}</span>}
			{right}
		</div>
	);
}
