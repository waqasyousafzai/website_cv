import type { ChangeEvent, ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Single-choice control; pill box with a glowing lime dot. */
export interface RadioProps {
	checked?: boolean;
	onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
	disabled?: boolean;
	label?: ReactNode;
	name?: string;
	value?: string;
	className?: string;
}

export function Radio({
	checked = false,
	onChange,
	disabled = false,
	label,
	name,
	value,
	className,
}: RadioProps) {
	return (
		<label
			className={cn(
				"ds-check",
				"ds-check--radio",
				checked && "ds-check--on",
				disabled && "ds-check--disabled",
				className,
			)}
		>
			<input
				checked={checked}
				className="absolute h-0 w-0 opacity-0"
				disabled={disabled}
				name={name}
				onChange={onChange}
				type="radio"
				value={value}
			/>
			<span aria-hidden="true" className="ds-check__box">
				{checked ? <span className="ds-check__dot" /> : null}
			</span>
			{label && <span>{label}</span>}
		</label>
	);
}
