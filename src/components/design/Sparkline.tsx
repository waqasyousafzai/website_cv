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
	return (
		<div
			className={cn("ds-spark", className)}
			style={{ height, ...style }}
			{...rest}
		>
			<svg
				aria-hidden="true"
				className="ds-spark__svg"
				preserveAspectRatio="none"
				viewBox="0 0 100 100"
			>
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
