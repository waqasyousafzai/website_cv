import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";
import type { Status } from "./types";

/** Run-state pill. The status vocabulary is shared with PipelineNode and LogStream. */
export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
	/** @default "idle" */
	status?: Status;
	/** Filled lime treatment for a single hero emphasis. @default false */
	solid?: boolean;
	/** @default true */
	dot?: boolean;
	children?: ReactNode;
}

export function Badge({
	status = "idle",
	solid = false,
	dot = true,
	children,
	className,
	...rest
}: BadgeProps) {
	return (
		<span
			className={cn(
				"ds-badge",
				`ds-badge--${status}`,
				solid && "ds-badge--solid",
				className,
			)}
			{...rest}
		>
			{dot && <span className="ds-badge__dot" />}
			{children}
		</span>
	);
}
