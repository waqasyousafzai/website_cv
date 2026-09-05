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
	return (
		// The control sits two levels down inside a sub-component, so the label is
		// tied to it by id rather than by nesting alone.
		<label className={cn("ds-field", className)} htmlFor={id} style={style}>
			{label && <span className="ds-field__label">{label}</span>}
			<span
				className={cn(
					"ds-input",
					props.multiline && "ds-input--textarea",
					error && "ds-input--error",
					disabled && "ds-input--disabled",
				)}
			>
				{prefix && <span className="ds-input__affix">{prefix}</span>}
				{props.multiline ? (
					<Multiline {...props} id={id} />
				) : (
					<SingleLine {...props} id={id} />
				)}
				{suffix && <span className="ds-input__affix">{suffix}</span>}
			</span>
			{(error || hint) && (
				<span
					className={cn("ds-field__hint", error && "ds-field__hint--error")}
				>
					{error || hint}
				</span>
			)}
		</label>
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
