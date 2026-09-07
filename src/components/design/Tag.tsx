import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Neutral metadata chip — tech stack, tools, filters. */
export interface TagProps extends HTMLAttributes<HTMLSpanElement> {
	/** Lime treatment for selected filters. @default false */
	signal?: boolean;
	/** Renders a dismiss affordance. */
	onRemove?: () => void;
	children?: ReactNode;
}

export function Tag({
	signal = false,
	onRemove,
	children,
	className,
	...rest
}: TagProps) {
	return (
		<span
			className={cn("ds-tag", signal && "ds-tag--signal", className)}
			{...rest}
		>
			{children}
			{onRemove && (
				<button
					aria-label="Remove"
					className="ds-tag__x"
					onClick={onRemove}
					type="button"
				>
					×
				</button>
			)}
		</span>
	);
}
