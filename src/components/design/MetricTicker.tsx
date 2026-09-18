import type { CSSProperties, HTMLAttributes } from "react";
import { useReducedMotion } from "@/lib/use-reduced-motion";
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
 * Loops linearly and forever, and pauses on hover.
 *
 * Under `prefers-reduced-motion` the loop stops, and with it the only thing that
 * was bringing the far end of the strip into view — the set is wider than the
 * frame at every viewport this console runs at. So the strip becomes a scroll
 * region instead: the duplicate copy goes (it exists only to make the -50%
 * keyframe seamless), and the region takes a tab stop so a keyboard can reach
 * the values the frame cuts off. Nothing about the values themselves changes.
 */
export interface MetricTickerProps extends HTMLAttributes<HTMLDivElement> {
	items: MetricTickerItem[];
	/** Seconds for one full pass. Default 34. Slower reads calmer. */
	speed?: number;
	/** Names the strip. @default "Warehouse metrics" */
	label?: string;
	className?: string;
	style?: CSSProperties;
}

export function MetricTicker({
	items = [],
	speed = 34,
	label = "Warehouse metrics",
	className,
	style,
	...rest
}: MetricTickerProps) {
	const still = useReducedMotion();
	// The list is doubled so the -50% marquee keyframe lands on an identical
	// frame. The second copy is a mechanism, never content: it is the same seven
	// values again, so it is hidden from assistive technology at all times and
	// dropped entirely once the loop is not running.
	return (
		// biome-ignore lint/a11y/useSemanticElements: the strip is a labelled readout inside a console frame, not a landmark; a <section> would announce a region on every route.
		<div
			aria-label={label}
			className={cn("ds-ticker", className)}
			role="group"
			style={style}
			// Focusable only while it is a scroll region: under full motion the
			// marquee brings every value past, and a tab stop there leads nowhere.
			tabIndex={still ? 0 : undefined}
			{...rest}
		>
			<div
				className="ds-ticker__track"
				style={{ animationDuration: `${speed}s` }}
			>
				{items.map((it, i) => (
					// biome-ignore lint/suspicious/noArrayIndexKey: the strip is a fixed, ordered readout — a metric's identity here is its position, and two metrics may share a label.
					<Item item={it} key={i} />
				))}
				{!still &&
					items.map((it, i) => (
						// biome-ignore lint/suspicious/noArrayIndexKey: the second copy is the same list again, so only position tells its entries apart.
						<Item dup item={it} key={`dup-${i}`} />
					))}
			</div>
		</div>
	);
}

function Item({
	item,
	dup = false,
}: {
	item: MetricTickerItem;
	dup?: boolean;
}) {
	return (
		<span
			aria-hidden={dup || undefined}
			className={cn("ds-ticker__item", dup && "ds-ticker__item--dup")}
		>
			<span className="ds-ticker__label">{item.label}</span>
			<span
				className={cn(
					"ds-ticker__value",
					item.status && `ds-ticker__value--${item.status}`,
				)}
			>
				{item.value}
			</span>
		</span>
	);
}
