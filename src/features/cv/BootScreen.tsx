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
				<div className="font-display text-h3 text-ink-0 leading-[1.05] tracking-display row:text-h2">
					{/* One line per part of the name, so the lockup follows the profile
					    rather than repeating it. */}
					{NAME_PARTS.map((part, i) => (
						<span key={part}>
							{part.toUpperCase()}
							{i < NAME_PARTS.length - 1 && <br />}
						</span>
					))}
					<span className="text-lime-500">.</span>
				</div>
				<div className="mt-s-5 font-data text-dim uppercase tracking-tag">
					{CV.role} / pipeline cv v2.4
				</div>
				<div className="mt-s-9">
					<LogStream height={104} lines={lines} />
				</div>
				<div className="mt-s-8 flex items-center gap-s-5">
					<Button
						leading={<Icon name="power" size={14} />}
						notched
						onClick={() => navigate({ to: "/pipeline" })}
						size="lg"
					>
						Initialise
					</Button>
					<span className="font-data text-dim">or press ENTER</span>
				</div>
			</div>
		</div>
	);
}
