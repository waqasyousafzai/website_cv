// biome-ignore-all lint/a11y/useSemanticElements: a clickable card may hold its
// own controls — the `actions` row included — and a <button> may not contain
// interactive descendants, so role + tabIndex is the only valid encoding here.
import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

// `title` is a DOM attribute (the native tooltip); the design system spends it
// on the header eyebrow instead.
/** Panel container: near-square corners, hairline border, no lift unless interactive. */
export interface CardProps
	extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
	/** Mono uppercase eyebrow in the header strip. */
	title?: ReactNode;
	/** Right-aligned header controls (usually IconButtons). */
	actions?: ReactNode;
	/** Clip top-right / bottom-left corners. @default false */
	notched?: boolean;
	/** Fine grid texture behind the body. @default false */
	grid?: boolean;
	interactive?: boolean;
	/** Lime hairline — marks the active/selected card. @default false */
	signal?: boolean;
	/** @default true */
	padded?: boolean;
	children?: ReactNode;
}

export function Card({
	title,
	actions,
	notched = false,
	grid = false,
	interactive = false,
	signal = false,
	padded = true,
	onClick,
	children,
	className,
	...rest
}: CardProps) {
	const classes = cn(
		"ds-card",
		notched && "ds-card--notched",
		grid && "ds-card--grid",
		interactive && "ds-card--interactive",
		signal && "ds-card--signal",
		className,
	);
	const inner = (
		<>
			{(title || actions) && (
				<div className="ds-card__head">
					<span className="ds-card__title">{title}</span>
					{actions && (
						<div className="flex items-center gap-s-4">{actions}</div>
					)}
				</div>
			)}
			<div className={padded ? "ds-card__body" : undefined}>{children}</div>
		</>
	);

	// A whole card that reacts to a click is a control, so it takes a role, a tab
	// stop and keyboard activation — a card whose *content* holds the control
	// stays a plain container.
	if (onClick) {
		return (
			<div
				className={classes}
				onClick={onClick}
				onKeyDown={(e) => {
					if (e.key === "Enter" || e.key === " ") {
						e.preventDefault();
						e.currentTarget.click();
					}
				}}
				role="button"
				tabIndex={0}
				{...rest}
			>
				{inner}
			</div>
		);
	}
	return (
		<div className={classes} {...rest}>
			{inner}
		</div>
	);
}
