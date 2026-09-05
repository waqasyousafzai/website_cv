import type { CSSProperties, ReactNode, SelectHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface SelectOption {
	value: string;
	label: string;
}

/** Native select in the field shell, with a mono caret. */
export interface SelectProps
	extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "className" | "style"> {
	label?: ReactNode;
	hint?: ReactNode;
	options: SelectOption[];
	className?: string;
	style?: CSSProperties;
}

export function Select({
	label,
	hint,
	options = [],
	className,
	style,
	...rest
}: SelectProps) {
	return (
		<label className={cn("ds-field", className)} style={style}>
			{label && <span className="ds-field__label">{label}</span>}
			<span className="ds-select">
				<select className="ds-select__el" {...rest}>
					{options.map((o) => (
						<option key={o.value} value={o.value}>
							{o.label}
						</option>
					))}
				</select>
				<span className="ds-select__caret">▾</span>
			</span>
			{hint && <span className="ds-field__hint">{hint}</span>}
		</label>
	);
}
