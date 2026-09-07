import type { CSSProperties, HTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import type { SignalStatus } from "./types";

export interface MetricTickerItem {
	/** Uppercase mono label, e.g. "rows / day". */
	label: string;
	/** The figure, e.g. "1.2 B". */
	value: string;
	/** Tints the value. Default inherits body ink. */
	status?: SignalStatus;
}

/**
 * A single-line marquee of warehouse metrics — the strip along the foot of a console.
 * Loops linearly and forever; pauses on hover and under `prefers-reduced-motion`.
 */
export interface MetricTickerProps extends HTMLAttributes<HTMLDivElement> {
	items: MetricTickerItem[];
	/** Seconds for one full pass. Default 34. Slower reads calmer. */
	speed?: number;
	className?: string;
	style?: CSSProperties;
}

export function MetricTicker({
	items = [],
	speed = 34,
	className,
	style,
	...rest
}: MetricTickerProps) {
	// The list is doubled so the -50% marquee keyframe lands on an identical frame.
	const run = items.concat(items);
	return (
		<div className={cn("ds-ticker", className)} style={style} {...rest}>
			<div
				className="ds-ticker__track"
				style={{ animationDuration: `${speed}s` }}
			>
				{run.map((it, i) => (
					<span
						className="ds-ticker__item"
						// biome-ignore lint/suspicious/noArrayIndexKey: the track is deliberately two copies of the same list, so labels are not unique — position is.
						key={i}
					>
						<span className="ds-ticker__label">{it.label}</span>
						<span
							className={cn(
								"ds-ticker__value",
								it.status && `ds-ticker__value--${it.status}`,
							)}
						>
							{it.value}
						</span>
					</span>
				))}
			</div>
		</div>
	);
}
