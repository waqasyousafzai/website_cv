import { Switch as SwitchPrimitive } from "radix-ui";
import type * as React from "react";
import { cn } from "@/lib/utils";

// Generated with `shadcn add switch`, then restyled onto `ds-switch*`. Radix
// gives the track role="switch" and Space/Enter activation; the hidden checkbox
// the prototype used gave neither.
export interface SwitchProps
	extends Omit<
		React.ComponentProps<typeof SwitchPrimitive.Root>,
		"children" | "className"
	> {
	/** Uppercase mono caption beside the track. */
	label?: React.ReactNode;
	className?: string;
}

function Switch({
	checked,
	disabled,
	label,
	className,
	id,
	...props
}: SwitchProps) {
	const track = (
		<SwitchPrimitive.Root
			checked={checked}
			className="ds-switch__track"
			data-slot="switch"
			disabled={disabled}
			id={id}
			{...props}
		>
			<SwitchPrimitive.Thumb className="ds-switch__knob" data-slot="switch-thumb" />
		</SwitchPrimitive.Root>
	);
	const classes = cn(
		"ds-switch",
		checked && "ds-switch--on",
		disabled && "ds-switch--disabled",
		className,
	);
	// Radix renders a <button>, so the caption is a sibling label element rather
	// than a wrapper — a <label> may not contain a button.
	return label ? (
		<span className={classes}>
			{track}
			<label htmlFor={id}>{label}</label>
		</span>
	) : (
		<span className={classes}>{track}</span>
	);
}

export { Switch };
