import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Icon, type IconName } from "./Icon";
import type { NodeStatus } from "./types";

export type { NodeStatus };

const STATUS_LABELS: Record<NodeStatus, string> = {
	idle: "idle",
	running: "running",
	ok: "completed",
	warn: "warning",
	fail: "failed",
};

/**
 * The state as a shape, so a stage is never told apart by hue alone. It rides
 * the stage symbol rather than the label row, which is already full at the
 * widest label in the DAG. The word itself stays in the `sr-only` prefix.
 */
const STATUS_MARKS: Record<NodeStatus, string> = {
	idle: "\u2013",
	running: "\u25B8",
	ok: "\u2713",
	warn: "!",
	fail: "\u2715",
};

/** One stage in the CV pipeline: source, ingest, transform, model, serve. */
export interface PipelineNodeProps
	extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type"> {
	/** Stage name, uppercased by CSS — write it as snake_case source truth. */
	label: ReactNode;
	/** Second line: stage type, e.g. "kafka topic", "dbt model". */
	kind?: ReactNode;
	/** @default "box" */
	icon?: IconName;
	/** @default "idle" */
	status?: NodeStatus;
	/** Row count string, e.g. "1.2M rows". */
	rows?: ReactNode;
	/** Wall time string, e.g. "4.1s". */
	duration?: ReactNode;
	selected?: boolean;
}

// The node is the graph's primary control, so it is a real button: the
// prototype's clickable <div> was mouse-only and announced nothing.
export function PipelineNode({
	label,
	kind,
	icon = "box",
	status = "idle",
	rows,
	duration,
	selected = false,
	className,
	...rest
}: PipelineNodeProps) {
	return (
		<button
			aria-pressed={selected}
			className={cn(
				"ds-node",
				`ds-node--${status}`,
				selected && "ds-node--selected",
				"text-left",
				className,
			)}
			type="button"
			{...rest}
		>
			<span className="sr-only">{STATUS_LABELS[status]}: </span>
			<div className="ds-node__top">
				<span className="ds-node__icon">
					<Icon name={icon} size={15} />
					<span aria-hidden="true" className="ds-node__flag">
						{STATUS_MARKS[status]}
					</span>
				</span>
				<span className="ds-node__label">{label}</span>
			</div>
			{kind && (
				<div className="ds-node__meta">
					<span>{kind}</span>
				</div>
			)}
			{(rows || duration) && (
				<div className="ds-node__meta ds-node__meta--figures">
					<span>{rows || ""}</span>
					<span>{duration || ""}</span>
				</div>
			)}
		</button>
	);
}
