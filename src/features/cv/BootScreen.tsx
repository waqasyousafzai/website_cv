import { useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Icon, type LogLine, LogStream } from "@/components/design";
import { Button } from "@/components/ui/button";
import { count } from "@/lib/utils";
import { CV, EDGES, NAME_PARTS, NODES } from "./data";

const BOOT: ReadonlyArray<[LogLine["level"], string]> = [
	["info", `${NAME_PARTS[0].toLowerCase()}-cv v2.4 — pipeline runtime`],
	[
		"info",
		`loading dag: ${count(NODES.length, "stage")}, ${count(EDGES.length, "edge")}`,
	],
	["info", "warehouse: analytics_wh (XS)"],
	["ok", "dag compiled · press enter to initialise"],
];

const LINE_EVERY = 260;

/** Cold-boot panel. Initialise (or Enter) hands over to the pipeline route. */
export function BootScreen() {
	const navigate = useNavigate();
	const [lines, setLines] = useState<LogLine[]>([]);

	useEffect(() => {
		let i = 0;
		const t = setInterval(() => {
			i++;
			setLines(
				BOOT.slice(0, i).map((l, k) => ({
					ts: `00:00.${String(120 * k + 4).padStart(3, "0")}`,
					level: l[0],
					msg: l[1],
				})),
			);
			if (i >= BOOT.length) clearInterval(t);
		}, LINE_EVERY);
		return () => clearInterval(t);
	}, []);

	useEffect(() => {
		const onKey = (e: KeyboardEvent) => {
			if (e.key === "Enter") navigate({ to: "/pipeline" });
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [navigate]);

	return (
		<div
			// `items-center-safe`, not `items-center`: on a viewport too short for the
			// panel, centring would push its top above the scroll origin and put it
			// out of reach. Safe alignment falls back to start once it overflows.
			className="flex h-full items-center-safe justify-center overflow-y-auto bg-void-0 p-s-5"
			style={{ backgroundImage: "var(--vignette),var(--grid-coarse)" }}
		>
			<div
				className="w-full max-w-[620px] border border-hair bg-panel p-s-7 shadow-panel row:p-s-9 console:p-s-11"
				style={{ clipPath: "var(--notch-14)" }}
			>
				<div className="font-display font-extralight text-h2 text-ink-0 leading-(--lh-tight) tracking-display row:text-h1">
					{/* One line per part of the name, so the lockup follows the profile
					    rather than repeating it. */}
					{NAME_PARTS.map((part, i) => (
						<span key={part}>
							{part.toUpperCase()}
							{i < NAME_PARTS.length - 1 && <br />}
						</span>
					))}
					<span className="text-signal-primary">.</span>
				</div>
				{/* The role reads a step brighter than the build tag after it. Each half
				    stays whole, so a narrow card breaks at the slash, not mid-phrase. */}
				<div className="mt-s-6 font-data text-dim uppercase tracking-label">
					<span className="whitespace-nowrap text-muted">{CV.role}</span>{" "}
					<span className="whitespace-nowrap">/ pipeline cv v2.4</span>
				</div>
				<div className="mt-s-9 row:mt-s-10">
					<LogStream
						// Sized for the completed boot sequence from first paint, so no line
						// is clipped and the reveal never moves the layout. The `height`
						// prop's inline px would beat these classes, so it is cleared.
						// Measured box heights: 214px holds the wrapped sequence from a
						// 356px viewport (365px when the frame scrolls); 124px holds it
						// unwrapped from 545px. Narrower, the log scrolls to its tail.
						className="h-[214px] row:h-[124px]"
						lines={lines}
						style={{ height: undefined }}
					/>
				</div>
				{/* The handoff: one hairline, the only gold action, and its key. */}
				<div className="mt-s-8 flex flex-wrap items-center gap-x-s-6 gap-y-s-4 border-hair border-t pt-s-7 row:mt-s-9 row:pt-s-8">
					<Button
						leading={<Icon name="power" size={14} />}
						notched
						onClick={() => navigate({ to: "/pipeline" })}
						size="lg"
					>
						Initialise
					</Button>
					<span className="font-data text-dim">
						or press{" "}
						<kbd className="inline-block rounded-1 border border-hair bg-raised px-s-3 py-s-1 font-data text-muted">
							ENTER
						</kbd>
					</span>
				</div>
			</div>
		</div>
	);
}
