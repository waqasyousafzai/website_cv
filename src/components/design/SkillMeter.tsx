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
}

export function SkillMeter({
	label,
	value = 0,
	max = 5,
	level,
	className,
	...rest
}: SkillMeterProps) {
	const ticks = Array.from({ length: max }, (_, i) => i < value);
	return (
		<div className={cn("ds-meter", className)} {...rest}>
			<div className="ds-meter__top">
				<span>{label}</span>
				{level && <span className="ds-meter__level">{level}</span>}
			</div>
			<div className="ds-meter__ticks">
				{ticks.map((on, i) => (
					<span
						className={cn("ds-meter__tick", on && "ds-meter__tick--on")}
						// biome-ignore lint/suspicious/noArrayIndexKey: the ticks are a fixed-length positional scale — tick 3 is tick 3, it has no other identity.
						key={i}
					/>
				))}
			</div>
		</div>
	);
}
