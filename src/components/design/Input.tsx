import {
	type CSSProperties,
	type InputHTMLAttributes,
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
	const labelId = label ? `${generated}-label` : undefined;
	// Two label elements point at the control, and browsers concatenate every
	// associated label into the accessible name — which would fold a text affix
	// into it. Naming the control from the visible label alone keeps the name
	// exactly what the caption says.
	const labelledBy = props["aria-labelledby"] ?? labelId;
	const describedBy =
		[props["aria-describedby"], descriptionId].filter(Boolean).join(" ") ||
		undefined;
	const invalid = error ? true : props["aria-invalid"];
	return (
		<div className={cn("ds-field", className)} style={style}>
			{label && (
				<label className="ds-field__label" htmlFor={id} id={labelId}>
					{label}
				</label>
			)}
			{/* A second label, deliberately text-free: it makes the whole field
			    chrome — padding and affixes included — a click target that focuses
			    the control, which a plain wrapper element would not. The control is
			    a descendant, so `htmlFor` only pins that association explicitly. */}
			<label
				className={cn(
					"ds-input",
					props.multiline && "ds-input--textarea",
					error && "ds-input--error",
					disabled && "ds-input--disabled",
				)}
				htmlFor={id}
			>
				{prefix && <span className="ds-input__affix">{prefix}</span>}
				{props.multiline ? (
					<Multiline
						{...props}
						aria-describedby={describedBy}
						aria-invalid={invalid}
						aria-labelledby={labelledBy}
						id={id}
					/>
				) : (
					<SingleLine
						{...props}
						aria-describedby={describedBy}
						aria-invalid={invalid}
						aria-labelledby={labelledBy}
						id={id}
					/>
				)}
				{suffix && <span className="ds-input__affix">{suffix}</span>}
			</label>
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
