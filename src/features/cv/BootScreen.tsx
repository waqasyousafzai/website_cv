import { useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Icon, type LogLine, LogStream } from "@/components/design";
import { Button } from "@/components/ui/button";

const BOOT: ReadonlyArray<[LogLine["level"], string]> = [
	["info", "waqas-cv v2.4 — pipeline runtime"],
	["info", "loading dag: 7 stages, 7 edges"],
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
			className="flex h-full items-center justify-center bg-void-0"
			style={{ backgroundImage: "var(--vignette),var(--grid-coarse)" }}
		>
			<div
				className="w-[620px] border border-hair bg-panel p-s-11 shadow-panel"
				style={{ clipPath: "var(--notch-14)" }}
			>
				<div className="font-display text-h2 text-ink-0 leading-[1.05] tracking-display">
					WAQAS
					<br />
					YOUSAFZAI<span className="text-lime-500">.</span>
				</div>
				<div className="mt-s-5 font-data text-dim uppercase tracking-tag">
					data engineer / pipeline cv v2.4
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
