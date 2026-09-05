import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Badge } from "./Badge";
import type { NodeStatus } from "./types";

/** Output panel that emerges from a clicked PipelineNode: stage identity, counters, and the data it produced. */
export interface NodeCalloutProps
	extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
	/** Stage id, e.g. "fct_cv". */
	title: ReactNode;
	/** Stage type line. */
	kind?: ReactNode;
	/** @default "ok" */
	status?: NodeStatus;
	rows?: ReactNode;
	duration?: ReactNode;
	/** Which edge the connector stub sits on. @default "right" */
	side?: "right" | "left" | "top" | "bottom";
	/** Footer action row. */
	actions?: ReactNode;
	onClose?: () => void;
	children?: ReactNode;
}

export function NodeCallout({
	title,
	kind,
	status = "ok",
	rows,
	duration,
	side = "right",
	actions,
	onClose,
	children,
	className,
	...rest
}: NodeCalloutProps) {
	return (
		<div
			className={cn("ds-callout", `ds-callout--${side}`, className)}
			{...rest}
		>
			<span className="ds-callout__stub" />
			<div className="ds-callout__head">
				<span className="ds-callout__title">{title}</span>
				{status && <Badge status={status}>{status}</Badge>}
				{onClose && (
					<button
						aria-label="Close"
						className="ds-callout__x"
						onClick={onClose}
						type="button"
					>
						×
					</button>
				)}
			</div>
			{(kind || rows || duration) && (
				<div className="ds-callout__meta">
					{kind && <span>{kind}</span>}
					{rows && <span>{rows}</span>}
					{duration && <span>{duration}</span>}
				</div>
			)}
			<div className="ds-callout__body">{children}</div>
			{actions && <div className="ds-callout__foot">{actions}</div>}
		</div>
	);
}
