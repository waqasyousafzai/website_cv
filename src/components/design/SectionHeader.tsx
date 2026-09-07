import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Numbered section rule used down the CV: index, display title, right-aligned note. */
export interface SectionHeaderProps
	extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
	/** Stage marker, e.g. "02" or "STAGE 02". */
	index?: ReactNode;
	title: ReactNode;
	/** Muted right-hand meta — record counts, dates, source names. */
	note?: ReactNode;
}

export function SectionHeader({
	index,
	title,
	note,
	className,
	...rest
}: SectionHeaderProps) {
	return (
		<div className={cn("ds-section", className)} {...rest}>
			{index != null && <span className="ds-section__idx">{index}</span>}
			<h2 className="ds-section__title">{title}</h2>
			{note && <span className="ds-section__note">{note}</span>}
		</div>
	);
}
