import { Tooltip as TooltipPrimitive } from "radix-ui";
import type * as React from "react";
import { cn } from "@/lib/utils";

// Generated with `shadcn add tooltip`, then restyled onto `ds-tip__bubble` and
// narrowed to the design system's content/children API. Two things the
// CSS-only prototype could not do: show on keyboard focus, and escape the
// graph canvas's `overflow: hidden` (the bubble is portalled).
function TooltipProvider({
	delayDuration = 120,
	...props
}: React.ComponentProps<typeof TooltipPrimitive.Provider>) {
	return (
		<TooltipPrimitive.Provider
			data-slot="tooltip-provider"
			delayDuration={delayDuration}
			{...props}
		/>
	);
}

export interface TooltipProps
	extends Omit<React.ComponentProps<typeof TooltipPrimitive.Content>, "content"> {
	/** Short mono string — a value, a full table name, a keyboard hint. */
	content: React.ReactNode;
	/** Force visible (docs / cards). */
	open?: boolean;
	children?: React.ReactNode;
}

function Tooltip({
	content,
	open,
	children,
	className,
	sideOffset = 8,
	...props
}: TooltipProps) {
	return (
		<TooltipPrimitive.Root data-slot="tooltip" open={open}>
			{/* asChild puts the hover/focus handlers on the real control, so the
			    bubble answers keyboard focus and not just the pointer. */}
			<TooltipPrimitive.Trigger asChild data-slot="tooltip-trigger">
				{children}
			</TooltipPrimitive.Trigger>
			<TooltipPrimitive.Portal>
				<TooltipPrimitive.Content
					className={cn("ds-tip__bubble", className)}
					data-slot="tooltip-content"
					sideOffset={sideOffset}
					{...props}
				>
					{content}
				</TooltipPrimitive.Content>
			</TooltipPrimitive.Portal>
		</TooltipPrimitive.Root>
	);
}

export { Tooltip, TooltipProvider };
