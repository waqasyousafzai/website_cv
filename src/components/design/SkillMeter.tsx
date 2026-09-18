import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Segmented capability meter — discrete ticks, never a smooth bar. */
export interface SkillMeterProps extends HTMLAttributes<HTMLDivElement> {
	/** Tool or skill name in its own casing: "dbt", "Snowflake", "Kafka". */
	label: ReactNode;
	/** Filled ticks. @default 0 */
	value?: number;
	/** @default 5 */
	max?: number;
	/** Word for the level, e.g. "daily driver", "production". */
	level?: ReactNode;
	/**
	 * Plain-text name for the meter, when `label` is not a plain string. The
	 * meter announces a value and a scale, so it needs a name that is text.
	 */
	name?: string;
}

export function SkillMeter({
	label,
	value = 0,
	max = 5,
	level,
	name,
	className,
	...rest
}: SkillMeterProps) {
	const ticks = Array.from({ length: max }, (_, i) => i < value);
	const named = name ?? (typeof label === "string" ? label : undefined);
	return (
		<div className={cn("ds-meter", className)} {...rest}>
			<div className="ds-meter__top">
				<span>{label}</span>
				{level && <span className="ds-meter__level">{level}</span>}
				{/* Counting filled ticks is a reading, not a value. Write it down. */}
				<span className="ds-meter__score">
					{value}/{max}
				</span>
			</div>
			{/* The ticks are the picture; the meter role is what carries the value
			    and the scale to anything that cannot see them. */}
			{/* biome-ignore lint/a11y/useSemanticElements: a native <meter> brings the platform's own bar rendering, which is the one thing this segmented tick row exists to replace. */}
			<div
				aria-label={named}
				aria-valuemax={max}
				aria-valuemin={0}
				aria-valuenow={value}
				aria-valuetext={
					level ? `${value} of ${max} — ${level}` : `${value} of ${max}`
				}
				className="ds-meter__ticks"
				role="meter"
			>
				{ticks.map((on, i) => (
					<span
						aria-hidden="true"
						className={cn("ds-meter__tick", on && "ds-meter__tick--on")}
						// biome-ignore lint/suspicious/noArrayIndexKey: the ticks are a fixed-length positional scale — tick 3 is tick 3, it has no other identity.
						key={i}
					/>
				))}
			</div>
		</div>
	);
}
