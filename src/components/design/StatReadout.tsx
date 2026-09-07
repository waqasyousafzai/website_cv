import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Single metric with a lime left rail — throughput, uptime, years, cost saved. */
export interface StatReadoutProps extends HTMLAttributes<HTMLDivElement> {
	label: ReactNode;
	/** Display-face number. Keep it short: "1.2B", "99.98%", "7". */
	value: ReactNode;
	/** Small mono unit after the value. */
	unit?: ReactNode;
	/** Change line, e.g. "-38% runtime". */
	delta?: ReactNode;
	/** Renders the delta magenta. @default false */
	down?: boolean;
}

export function StatReadout({
	label,
	value,
	unit,
	delta,
	down = false,
	className,
	...rest
}: StatReadoutProps) {
	return (
		<div className={cn("ds-stat", className)} {...rest}>
			<span className="ds-stat__label">{label}</span>
			<span className="ds-stat__value">
				{value}
				{unit && (
					<span className="ml-s-3 font-mono text-meta text-dim">{unit}</span>
				)}
			</span>
			{delta && (
				<span className={cn("ds-stat__delta", down && "ds-stat__delta--down")}>
					{delta}
				</span>
			)}
		</div>
	);
}
