import { useEffect, useState } from "react";
import {
	type Level,
	type MetricTickerItem,
	StatReadout,
	type Status,
} from "@/components/design";
import { CV } from "./data";

// Live-data helpers for the kit: a ticking series, a count-up numeral, the CV's
// statistics as count-up cards, run history and the footer ticker. The "live"
// values are simulated locally — there is no server to query.

/** A rolling window of throughput samples, one new reading every `every` ms. */
export function useLiveSeries(len = 40, every = 900) {
	const [v, setV] = useState(() =>
		Array.from(
			{ length: len },
			(_, i) => 52 + Math.sin(i / 2.4) * 16 + Math.sin(i / 1.3) * 6,
		),
	);
	useEffect(() => {
		const t = setInterval(
			() => setV((a) => [...a.slice(1), 38 + Math.random() * 42]),
			every,
		);
		return () => clearInterval(t);
	}, [every]);
	return v;
}

/** Eases a numeral up from zero on mount. Respects prefers-reduced-motion. */
export function useCountUp(target: number, ms = 760, go = true) {
	const [n, setN] = useState(target);
	useEffect(() => {
		if (!go) {
			setN(target);
			return;
		}
		if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
			setN(target);
			return;
		}
		let raf = 0;
		let t0 = 0;
		let alive = true;
		const step = (t: number) => {
			if (!alive) return;
			t0 = t0 || t;
			const k = Math.min(1, (t - t0) / ms);
			setN(target * (1 - (1 - k) ** 3));
			if (k < 1) raf = requestAnimationFrame(step);
		};
		setN(0);
		raf = requestAnimationFrame(step);
		// Frames may never arrive (hidden tab, capture, export) — snap to the real value.
		const bail = setTimeout(() => {
			if (alive && !t0) {
				alive = false;
				cancelAnimationFrame(raf);
				setN(target);
			}
		}, 260);
		const done = setTimeout(() => {
			if (alive) setN(target);
		}, ms + 120);
		return () => {
			alive = false;
			cancelAnimationFrame(raf);
			clearTimeout(bail);
			clearTimeout(done);
		};
	}, [target, ms, go]);
	return n;
}

export interface CountStatProps {
	label: string;
	value: string;
	unit?: string;
	delta?: string;
	down?: boolean;
}

/** StatReadout with the numeral counting up from zero on mount. */
export function CountStat({ label, value, unit, delta, down }: CountStatProps) {
	const dec = value.includes(".") ? value.split(".")[1].length : 0;
	const n = useCountUp(Number.parseFloat(value) || 0);
	return (
		<StatReadout
			delta={delta}
			down={down}
			label={label}
			unit={unit}
			value={n.toFixed(dec)}
		/>
	);
}

/**
 * The CV's own figures, laid out to the width they are given: one column in the
 * 340px inspector, a row across the replay page. Both surfaces show the same two
 * statistics, so neither writes them out again.
 */
export function CvStats() {
	return (
		<div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,160px),1fr))] gap-s-5">
			{CV.stats.map((s) => (
				<CountStat key={s.label} {...s} />
			))}
		</div>
	);
}

export interface RunRecord {
	id: string;
	when: string;
	state: Status;
	elapsed: string;
	stages: string;
	note: string;
}

export const RUNS: RunRecord[] = [
	{
		id: "4193",
		when: "today 04:00",
		state: "ok",
		elapsed: "00:11.6",
		stages: "7 / 7",
		note: "full refresh",
	},
	{
		id: "4192",
		when: "yesterday 04:00",
		state: "warn",
		elapsed: "00:14.2",
		stages: "7 / 7",
		note: "stg_projects: retried once",
	},
	{
		id: "4191",
		when: "2 days ago 04:00",
		state: "ok",
		elapsed: "00:11.1",
		stages: "7 / 7",
		note: "full refresh",
	},
	{
		id: "4190",
		when: "3 days ago 04:00",
		state: "fail",
		elapsed: "00:03.4",
		stages: "2 / 7",
		note: "src_skills: connection reset",
	},
];

/** The console transcript replayed for each archived run. */
export const RUN_LOG: Record<string, ReadonlyArray<[Level, string]>> = {
	"4193": [
		["info", "dag run started · full refresh"],
		["ok", "src_profile · 1 row"],
		["ok", "fct_cv materialized in 1.4s"],
		["ok", "run complete · 7 stages · 00:11.6"],
	],
	"4192": [
		["info", "dag run started · full refresh"],
		["warn", "stg_projects: retried after timeout"],
		["ok", "run complete · 7 stages · 00:14.2"],
	],
	"4191": [
		["info", "dag run started · full refresh"],
		["ok", "run complete · 7 stages · 00:11.1"],
	],
	"4190": [
		["info", "dag run started · full refresh"],
		["fail", "src_skills: connection reset"],
		["fail", "run aborted at stage 2"],
	],
};

/**
 * The strip along the foot of the console. The first entries are the CV's own
 * figures and record counts; `last run` and `warehouse` describe the simulated
 * runtime, which is the only thing here that is not read from the CV.
 */
export const TICKER: MetricTickerItem[] = [
	...CV.stats.map((s) => ({ label: s.label, value: s.value })),
	{ label: "roles", value: String(CV.experience.length) },
	{ label: "skills listed", value: String(CV.skills.length) },
	{ label: "based", value: CV.loc },
	{ label: "last run", value: "11.6 s" },
	{ label: "warehouse", value: "analytics_wh · XS" },
	{ label: "status", value: CV.status, status: "ok" },
];
