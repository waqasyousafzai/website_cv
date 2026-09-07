import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Square 1:1 button holding a single Lucide glyph. Always give it a label for a11y + tooltip. */
export interface IconButtonProps
	extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "aria-label"> {
	/** @default "md" */
	size?: "sm" | "md" | "lg";
	/** Adds hairline border + card fill (use on toolbars over imagery). @default false */
	bordered?: boolean;
	active?: boolean;
	/** Accessible name. */
	label: string;
	children?: ReactNode;
}

export function IconButton({
	size = "md",
	bordered = false,
	active = false,
	label,
	children,
	className,
	...rest
}: IconButtonProps) {
	return (
		<button
			aria-label={label}
			className={cn(
				"ds-iconbtn",
				`ds-iconbtn--${size}`,
				bordered && "ds-iconbtn--bordered",
				active && "ds-iconbtn--active",
				className,
			)}
			type="button"
			{...rest}
		>
			{children}
		</button>
	);
}
