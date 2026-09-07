import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

/** One record in the experience log: date range, role, org, body, stack tags. */
// `role` here is the job title, not the ARIA attribute.
export interface TimelineEntryProps
	extends Omit<HTMLAttributes<HTMLDivElement>, "role"> {
	/** Range, e.g. "2022 — present". */
	when: ReactNode;
	role: ReactNode;
	org?: ReactNode;
	/** Tag row (usually <Tag> children). */
	tags?: ReactNode;
	/** Omits the connecting rail. @default false */
	last?: boolean;
	children?: ReactNode;
}

export function TimelineEntry({
	when,
	role,
	org,
	children,
	tags,
	last = false,
	className,
	...rest
}: TimelineEntryProps) {
	return (
		<div className={cn("ds-timeline", className)} {...rest}>
			<div className="ds-timeline__rail">
				<span className="ds-timeline__node" />
				{!last && <span className="ds-timeline__line" />}
			</div>
			<div className={cn("flex-1", last ? "pb-0" : "pb-s-9")}>
				<div className="ds-timeline__when">{when}</div>
				<div className="ds-timeline__role">{role}</div>
				{org && <div className="ds-timeline__org">{org}</div>}
				{children && <div className="ds-timeline__body">{children}</div>}
				{tags && <div className="mt-s-5 flex flex-wrap gap-s-3">{tags}</div>}
			</div>
		</div>
	);
}
