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
}

export function RunStatusBar({
	state = "idle",
	progress = 0,
	stage,
	rows,
	elapsed,
	right,
	className,
	...rest
}: RunStatusBarProps) {
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
			<span className="ds-runbar__meter">
				<span
					className="ds-runbar__fill"
					style={{ width: `${Math.max(0, Math.min(100, progress))}%` }}
				/>
			</span>
			{rows && <span>{rows}</span>}
			{elapsed && <span>{elapsed}</span>}
			{right}
		</div>
	);
}
