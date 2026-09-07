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

/** Append-only console. Auto-scrolls to the tail and shows a blinking block cursor. */
export interface LogStreamProps extends HTMLAttributes<HTMLDivElement> {
	lines: LogLine[];
	/** Fixed px height — the stream scrolls inside it. @default 180 */
	height?: number;
	/** @default true */
	cursor?: boolean;
}

export function LogStream({
	lines = [],
	height = 180,
	cursor = true,
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
		<div
			className={cn("ds-log", className)}
			ref={ref}
			style={{ height, ...style }}
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
						{l.level || "info"}
					</span>
					<span className="ds-log__msg">{l.msg}</span>
				</div>
			))}
			{cursor && <span className="ds-log__cursor" />}
		</div>
	);
}
