import type { ChangeEvent, ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Square checkbox, lime fill when on. Controlled. */
export interface CheckboxProps {
	checked?: boolean;
	onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
	disabled?: boolean;
	label?: ReactNode;
	className?: string;
}

export function Checkbox({
	checked = false,
	onChange,
	disabled = false,
	label,
	className,
}: CheckboxProps) {
	return (
		<label
			className={cn(
				"ds-check",
				checked && "ds-check--on",
				disabled && "ds-check--disabled",
				className,
			)}
		>
			<input
				checked={checked}
				className="absolute h-0 w-0 opacity-0"
				disabled={disabled}
				onChange={onChange}
				type="checkbox"
			/>
			<span aria-hidden="true" className="ds-check__box">
				{checked ? (
					<svg aria-hidden="true" height={10} viewBox="0 0 10 10" width={10}>
						<path
							d="M1 5.2 3.6 8 9 1.8"
							fill="none"
							stroke="currentColor"
							strokeWidth={2}
						/>
					</svg>
				) : null}
			</span>
			{label && <span>{label}</span>}
		</label>
	);
}
