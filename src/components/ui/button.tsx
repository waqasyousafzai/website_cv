import { type VariantProps, cva } from "class-variance-authority";
import { Slot } from "radix-ui";
import type * as React from "react";
import { cn } from "@/lib/utils";

// Generated with `shadcn add button`, then restyled onto the design system's
// `ds-btn` classes: the variant/size vocabulary is the design system's, the
// Slot-based `asChild` and the file's shape are shadcn's.
const buttonVariants = cva("ds-btn", {
	variants: {
		variant: {
			primary: "ds-btn--primary",
			secondary: "ds-btn--secondary",
			ghost: "ds-btn--ghost",
			danger: "ds-btn--danger",
		},
		size: {
			sm: "ds-btn--sm",
			md: "ds-btn--md",
			lg: "ds-btn--lg",
		},
		notched: { true: "ds-btn--notched", false: "" },
		block: { true: "ds-btn--block", false: "" },
	},
	defaultVariants: { variant: "primary", size: "md" },
});

export type ButtonProps = React.ComponentProps<"button"> &
	VariantProps<typeof buttonVariants> & {
		/** Render the single child element instead of a <button> — links, mostly. */
		asChild?: boolean;
		/** Icon node before the label. Ignored under asChild, which takes one child. */
		leading?: React.ReactNode;
		trailing?: React.ReactNode;
	};

function Button({
	className,
	variant,
	size,
	notched,
	block,
	asChild = false,
	leading,
	trailing,
	children,
	...props
}: ButtonProps) {
	const Comp = asChild ? Slot.Root : "button";
	return (
		<Comp
			className={cn(buttonVariants({ variant, size, notched, block, className }))}
			data-slot="button"
			type={asChild ? undefined : "button"}
			{...props}
		>
			{asChild ? (
				children
			) : (
				<>
					{leading}
					{children}
					{trailing}
				</>
			)}
		</Comp>
	);
}

export { Button, buttonVariants };
