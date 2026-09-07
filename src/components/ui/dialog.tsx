import { Dialog as DialogPrimitive } from "radix-ui";
import type * as React from "react";
import { cn } from "@/lib/utils";

// Generated with `shadcn add dialog`, then restyled onto `ds-dialog*`. Radix
// brings what the prototype's scrim-plus-div could not: focus trap, ESC,
// scroll lock and the aria wiring.
function Dialog(props: React.ComponentProps<typeof DialogPrimitive.Root>) {
	return <DialogPrimitive.Root data-slot="dialog" {...props} />;
}

function DialogTrigger(props: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
	return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />;
}

function DialogClose(props: React.ComponentProps<typeof DialogPrimitive.Close>) {
	return <DialogPrimitive.Close data-slot="dialog-close" {...props} />;
}

function DialogOverlay({
	className,
	...props
}: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
	return (
		<DialogPrimitive.Overlay
			className={cn("ds-dialog__scrim", className)}
			data-slot="dialog-overlay"
			{...props}
		/>
	);
}

export interface DialogContentProps
	extends Omit<React.ComponentProps<typeof DialogPrimitive.Content>, "title"> {
	/** Display-face title, 2-4 words. Required — it is the dialog's accessible name. */
	title: React.ReactNode;
	/** Right-aligned action row, usually two Buttons. */
	footer?: React.ReactNode;
}

function DialogContent({
	className,
	title,
	footer,
	children,
	...props
}: DialogContentProps) {
	return (
		<DialogPrimitive.Portal data-slot="dialog-portal">
			<DialogOverlay />
			<DialogPrimitive.Content
				// The scrim is its own fixed layer under Radix, so the panel centres
				// itself and keeps the scrim's var(--s-9) breathing room on narrow screens.
				className={cn(
					"ds-dialog -translate-x-1/2 -translate-y-1/2 fixed top-1/2 left-1/2 z-[61] max-w-[calc(100vw-var(--s-12))]",
					className,
				)}
				// The body is a form, not prose: naming it as the description would
				// read the whole thing out as one string.
				aria-describedby={undefined}
				data-slot="dialog-content"
				{...props}
			>
				<div className="ds-dialog__head">
					<DialogPrimitive.Title className="ds-dialog__title">
						{title}
					</DialogPrimitive.Title>
					<DialogPrimitive.Close
						aria-label="Close"
						className="ds-iconbtn ds-iconbtn--sm"
					>
						×
					</DialogPrimitive.Close>
				</div>
				<div className="ds-dialog__body">{children}</div>
				{footer && <div className="ds-dialog__foot">{footer}</div>}
			</DialogPrimitive.Content>
		</DialogPrimitive.Portal>
	);
}

export { Dialog, DialogClose, DialogContent, DialogOverlay, DialogTrigger };
