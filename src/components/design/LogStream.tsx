import { type HTMLAttributes, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import type { Level } from "./types";

export interface LogLine {
	/** Monotonic timestamp, e.g. "00:04.118". */
	ts: string;
	/** @default "info" */
	level?: Level;
	msg: string;
}

/**
 * The level as a shape, beside the word that already names it. The mark is
 * decoration for scanning a long stream; the word is what carries the meaning,
 * so the mark stays out of the accessibility tree.
 */
const LEVEL_MARKS: Record<Level, string> = {
	info: "\u203A",
	ok: "\u2713",
	warn: "!",
	fail: "\u2715",
};

/** Append-only console. Auto-scrolls to the tail and shows a blinking block cursor. */
export interface LogStreamProps extends HTMLAttributes<HTMLDivElement> {
	lines: LogLine[];
	/** Fixed px height — the stream scrolls inside it. @default 180 */
	height?: number;
	/** @default true */
	cursor?: boolean;
	/**
	 * Names the stream, and makes its scroll region reachable from the keyboard.
	 * Two consoles on one screen need telling apart. @default "Console log"
	 */
	label?: string;
}

export function LogStream({
	lines = [],
	height = 180,
	cursor = true,
	label = "Console log",
	className,
	style,
	...rest
}: LogStreamProps) {
	const ref = useRef<HTMLDivElement>(null);
	useEffect(() => {
		const el = ref.current;
		if (el && lines.length) el.scrollTop = el.scrollHeight;
	}, [lines.length]);
	return (
		// biome-ignore lint/a11y/useSemanticElements: a <section> would change the element type this component exposes and the type of the scroll ref it keeps; the group role names the same scroll region without either.
		<div
			aria-label={label}
			className={cn("ds-log", className)}
			ref={ref}
			role="group"
			style={{ height, ...style }}
			// biome-ignore lint/a11y/noNoninteractiveTabindex: the stream scrolls, and arrow keys can only reach the tail of a long transcript if the region takes focus.
			tabIndex={0}
			{...rest}
		>
			{lines.map((l, i) => (
				<div
					className="ds-log__row"
					// biome-ignore lint/suspicious/noArrayIndexKey: an append-only log never reorders or removes a line, so the index is the line's stable identity — and timestamps repeat across replayed runs.
					key={i}
				>
					<span className="ds-log__ts">{l.ts}</span>
					<span
						className={cn("ds-log__lvl", `ds-log__lvl--${l.level || "info"}`)}
					>
						<span aria-hidden="true" className="ds-log__mark">
							{LEVEL_MARKS[l.level || "info"]}
						</span>
						{l.level || "info"}
					</span>
					<span className="ds-log__msg">{l.msg}</span>
				</div>
			))}
			{cursor && <span className="ds-log__cursor" />}
		</div>
	);
}
