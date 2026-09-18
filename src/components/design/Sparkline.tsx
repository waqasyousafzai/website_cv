import type { CSSProperties, HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

/**
 * A hairline trend line for a live series — throughput, latency, queue depth.
 * Stretches to its container width; the last point carries a 3px emission head.
 */
export interface SparklineProps extends HTMLAttributes<HTMLDivElement> {
	/** The series, oldest first. Scaled to its own min/max. */
	values: number[];
	/** Pixel height of the plot. Default 36. */
	height?: number;
	/** Stroke + head color. Any token; default `var(--signal-primary)`. */
	color?: string;
	/** Wash a 12%-alpha area under the line. Default false. */
	fill?: boolean;
	/** Stroke width in px (non-scaling). Default 1.25. */
	strokeWidth?: number;
	/** Draw the line on once, left to right, on mount. Default false. */
	draw?: boolean;
	/** Hairline at the foot of the plot. Default true. */
	baseline?: boolean;
	/**
	 * Horizontal gridlines between the baseline and the top of the plot, so a
	 * trend reads as a measurement rather than a shape. Default 0.
	 */
	grid?: number;
	/**
	 * What the plot is of. Given one, the plot becomes an image with this name
	 * and a text summary of its range; without one it stays decoration and keeps
	 * out of the accessibility tree — which is right when a card title or an
	 * adjacent readout already says what the line means.
	 */
	label?: string;
	/** Appended to the spoken summary, e.g. "rows per minute". */
	unit?: string;
	className?: string;
	style?: CSSProperties;
}

export function Sparkline({
	values = [],
	height = 36,
	color = "var(--signal-primary)",
	fill = false,
	strokeWidth = 1.25,
	draw = false,
	baseline = true,
	grid = 0,
	label,
	unit,
	className,
	style,
	...rest
}: SparklineProps) {
	const v = values.length ? values : [0, 0];
	const min = Math.min(...v);
	const max = Math.max(...v);
	const span = max - min || 1;
	const pts: Array<[number, number]> = v.map((n, i) => [
		v.length > 1 ? (i / (v.length - 1)) * 100 : 0,
		100 - ((n - min) / span) * 92 - 4,
	]);
	const d = pts
		.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(2)} ${y.toFixed(2)}`)
		.join(" ");
	const area = `${d} L100 100 L0 100 Z`;
	const [headX, headY] = pts[pts.length - 1];
	// The series read out in words. A line has no text of its own, so without
	// this the only thing announced would be the name — true but not informative.
	const round = (n: number) =>
		Math.abs(n) >= 100 ? n.toFixed(0) : n.toFixed(1);
	const tail = unit ? ` ${unit}` : "";
	const summary = `${label} — latest ${round(v[v.length - 1])}${tail}, low ${round(min)}, high ${round(max)}, ${v.length} samples`;
	// Gridlines divide the plot's own 4–96 band, which is where the line is
	// mapped; a line drawn at 0 or 100 would sit outside the data's own range.
	const rules = Array.from(
		{ length: grid },
		(_, i) => 4 + ((i + 1) * 92) / (grid + 1),
	);
	return (
		// biome-ignore lint/a11y/useAriaPropsSupportedByRole: the name and the img role are set by the same `label` — without one there is neither, and the plot stays decoration.
		<div
			aria-label={label ? summary : undefined}
			className={cn("ds-spark", className)}
			role={label ? "img" : undefined}
			style={{ height, ...style }}
			{...rest}
		>
			<svg
				aria-hidden="true"
				className="ds-spark__svg"
				preserveAspectRatio="none"
				viewBox="0 0 100 100"
			>
				{rules.map((y) => (
					<line
						className="ds-spark__grid"
						key={y}
						x1={0}
						x2={100}
						y1={y}
						y2={y}
					/>
				))}
				{baseline && (
					<line
						className="ds-spark__base"
						x1={0}
						x2={100}
						y1={99.5}
						y2={99.5}
					/>
				)}
				{fill && <path className="ds-spark__fill" d={area} fill={color} />}
				<path
					className={cn("ds-spark__line", draw && "ds-spark__line--draw")}
					d={d}
					pathLength={draw ? 1 : undefined}
					stroke={color}
					strokeWidth={strokeWidth}
					vectorEffect="non-scaling-stroke"
				/>
			</svg>
			<span
				aria-hidden="true"
				className="ds-spark__head"
				style={{
					left: `${headX}%`,
					top: `${headY}%`,
					background: color,
					color,
				}}
			/>
		</div>
	);
}
