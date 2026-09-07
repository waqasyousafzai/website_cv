import {
	type CSSProperties,
	type InputHTMLAttributes,
	type MouseEvent,
	type ReactNode,
	type TextareaHTMLAttributes,
	useId,
} from "react";
import { cn } from "@/lib/utils";

interface FieldShell {
	label?: ReactNode;
	/** Muted helper line under the field. */
	hint?: ReactNode;
	/** Error message — replaces the hint and turns the border magenta. */
	error?: ReactNode;
	/** Leading affix, e.g. a query prompt glyph or unit. */
	prefix?: ReactNode;
	suffix?: ReactNode;
	className?: string;
	style?: CSSProperties;
}

// `prefix` is an RDFa attribute on HTMLAttributes, so it has to be dropped from
// the DOM props before the design system's ReactNode version can take its place.
type SingleLineProps = FieldShell & { multiline?: false } & Omit<
		InputHTMLAttributes<HTMLInputElement>,
		"prefix" | "className" | "style"
	>;
type MultilineProps = FieldShell & { multiline: true } & Omit<
		TextareaHTMLAttributes<HTMLTextAreaElement>,
		"prefix" | "className" | "style"
	>;

/** Mono text field in an inset well. Focus paints a lime hairline. */
export type InputProps = SingleLineProps | MultilineProps;

export function Input(props: InputProps) {
	const { label, hint, error, prefix, suffix, className, style, disabled } =
		props;
	const generated = useId();
	const id = props.id ?? generated;
	const description = error || hint;
	const descriptionId = description ? `${generated}-description` : undefined;
	const describedBy =
		[props["aria-describedby"], descriptionId].filter(Boolean).join(" ") ||
		undefined;
	const invalid = error ? true : props["aria-invalid"];
	// The whole well is a click target, but only the caption may name the
	// control. Wrapping the chrome in a second <label> would do both: browsers
	// concatenate every associated label into the accessible name, so the
	// affixes would join it, and the generated association would outrank a
	// caller's `aria-label`. Forwarding the click keeps the naming untouched.
	const focusControl = (event: MouseEvent<HTMLSpanElement>) => {
		const interactive = (event.target as HTMLElement).closest<HTMLElement>(
			"input, textarea, select, button, a[href], [tabindex]:not([tabindex='-1'])",
		);
		// A click that already landed on something focusable keeps its own
		// behaviour: caret placement in the control, or an interactive affix.
		// The match has to be inside the well — `closest` otherwise walks out
		// into the surrounding page and finds, say, a dialog's tabindex="-1",
		// which would swallow every click.
		if (interactive && event.currentTarget.contains(interactive)) {
			return;
		}
		event.preventDefault();
		event.currentTarget.querySelector<HTMLElement>(".ds-input__el")?.focus();
	};
	return (
		<div className={cn("ds-field", className)} style={style}>
			{label && (
				<label className="ds-field__label" htmlFor={id}>
					{label}
				</label>
			)}
			{/* biome-ignore lint/a11y/noStaticElementInteractions: the well is not
			    itself interactive — it only widens the hit area of the control it
			    wraps, the way a <label> would. The control keeps every semantic
			    and all keyboard behaviour, so there is no role to add here. */}
			<span
				className={cn(
					"ds-input",
					props.multiline && "ds-input--textarea",
					error && "ds-input--error",
					disabled && "ds-input--disabled",
				)}
				onMouseDown={focusControl}
			>
				{prefix && <span className="ds-input__affix">{prefix}</span>}
				{props.multiline ? (
					<Multiline
						{...props}
						aria-describedby={describedBy}
						aria-invalid={invalid}
						id={id}
					/>
				) : (
					<SingleLine
						{...props}
						aria-describedby={describedBy}
						aria-invalid={invalid}
						id={id}
					/>
				)}
				{suffix && <span className="ds-input__affix">{suffix}</span>}
			</span>
			{description && (
				<span
					className={cn("ds-field__hint", error && "ds-field__hint--error")}
					id={descriptionId}
				>
					{description}
				</span>
			)}
		</div>
	);
}

function SingleLine({
	label: _label,
	hint: _hint,
	error: _error,
	prefix: _prefix,
	suffix: _suffix,
	className: _className,
	style: _style,
	multiline: _multiline,
	...rest
}: SingleLineProps) {
	return <input className="ds-input__el" {...rest} />;
}

function Multiline({
	label: _label,
	hint: _hint,
	error: _error,
	prefix: _prefix,
	suffix: _suffix,
	className: _className,
	style: _style,
	multiline: _multiline,
	rows = 4,
	...rest
}: MultilineProps) {
	return <textarea className="ds-input__el" rows={rows} {...rest} />;
}
