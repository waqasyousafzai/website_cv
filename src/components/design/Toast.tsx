import type { OutputHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";
import type { SignalStatus } from "./types";

/** Glass notification with a colored status rail. Stack bottom-right with gap var(--s-5). */
export interface ToastProps
	extends Omit<OutputHTMLAttributes<HTMLOutputElement>, "title"> {
	/** @default "ok" */
	status?: SignalStatus;
	title?: ReactNode;
	message?: ReactNode;
	onDismiss?: () => void;
}

export function Toast({
	status = "ok",
	title,
	message,
	onDismiss,
	className,
	...rest
}: ToastProps) {
	// <output> carries an implicit role="status", so the live region comes for free.
	return (
		<output
			className={cn("ds-toast", `ds-toast--${status}`, className)}
			{...rest}
		>
			<span className="ds-toast__rail" />
			<div className="flex-1">
				{title && <div className="ds-toast__title">{title}</div>}
				{message && <div className="ds-toast__msg">{message}</div>}
			</div>
			{onDismiss && (
				<button
					aria-label="Dismiss"
					className="ds-iconbtn ds-iconbtn--sm"
					onClick={onDismiss}
					type="button"
				>
					×
				</button>
			)}
		</output>
	);
}
