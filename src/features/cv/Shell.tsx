import { Link, useMatchRoute } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { Icon, type IconName, Sparkline } from "@/components/design";
import { Tooltip } from "@/components/ui/tooltip";
import { useLiveSeries } from "./live";

interface RailItem {
	to: "/pipeline" | "/replay";
	icon: IconName;
	label: string;
}

const ITEMS: RailItem[] = [
	{ to: "/pipeline", icon: "git-branch", label: "Pipeline" },
	{ to: "/replay", icon: "clapperboard", label: "Run replay" },
];

export function Rail({ onContact }: { onContact: () => void }) {
	return (
		// The rail narrows by width, gap and padding only. The buttons keep
		// `ds-iconbtn--md` at every width: that 34px sits in an unlayered design
		// system rule, which no Tailwind utility can win against per breakpoint.
		<div className="flex w-s-11 flex-none flex-col items-center gap-s-3 border-hair border-r bg-void-1 py-s-3 row:gap-s-4 row:py-s-4 console:w-rail console:gap-s-5 console:py-s-5">
			<div className="font-display text-[14px] text-lime-500 text-glow">WY</div>
			<div className="h-px w-[20px] bg-line console:w-[24px]" />
			{ITEMS.map((it) => (
				<Tooltip content={it.label} key={it.to}>
					<Link
						activeProps={{ className: "ds-iconbtn--active" }}
						aria-label={it.label}
						className="ds-iconbtn ds-iconbtn--md"
						to={it.to}
					>
						<Icon name={it.icon} size={17} />
					</Link>
				</Tooltip>
			))}
			<Tooltip content="Contact">
				<button
					aria-label="Contact"
					className="ds-iconbtn ds-iconbtn--md"
					onClick={onContact}
					type="button"
				>
					<Icon name="mail" size={17} />
				</button>
			</Tooltip>
			<div className="mt-auto flex flex-col gap-s-3 console:gap-s-4">
				<Tooltip content="Source repo">
					<button
						aria-label="Source"
						className="ds-iconbtn ds-iconbtn--md"
						type="button"
					>
						<Icon name="github" size={16} />
					</button>
				</Tooltip>
				<Tooltip content="Settings">
					<button
						aria-label="Settings"
						className="ds-iconbtn ds-iconbtn--md"
						type="button"
					>
						<Icon name="settings" size={16} />
					</button>
				</Tooltip>
			</div>
		</div>
	);
}

export function TopBar({ right }: { right?: ReactNode }) {
	const series = useLiveSeries(44, 900);
	const matchRoute = useMatchRoute();
	// The breadcrumb is a reading of the URL, so the router owns it rather than
	// each screen passing its own string up.
	const breadcrumb = matchRoute({ to: "/replay" })
		? "runs / prod / replay"
		: "dag / prod / full refresh";
	return (
		// Below `row:` the bar wraps onto a second line, so the fixed 52px height
		// becomes a minimum. Breadcrumb and sparkline are progressive: the
		// breadcrumb arrives at `split:`, the throughput readout at `console:`.
		<div className="flex min-h-topbar flex-none flex-wrap items-center gap-x-s-5 gap-y-s-3 border-hair border-b bg-void-1 px-s-5 py-s-3 row:h-topbar row:flex-nowrap row:py-s-0 console:gap-x-s-7 console:px-s-7">
			<span className="font-display text-[13px] text-ink-0 tracking-display">
				WAQAS<span className="text-lime-500">.</span>YOUSAFZAI
			</span>
			<span className="hidden font-data text-dim uppercase tracking-label split:inline">
				{breadcrumb}
			</span>
			<div className="ml-auto flex items-center gap-s-5 console:gap-s-6">
				<Tooltip content="Warehouse throughput · last 44 min">
					<div className="hidden w-[172px] items-center gap-s-5 console:flex">
						<span className="flex-none font-data text-dim text-micro uppercase tracking-label">
							thrpt
						</span>
						<Sparkline fill height={20} values={series} />
					</div>
				</Tooltip>
				<div className="hidden h-[20px] w-px bg-hair console:block" />
				{right}
			</div>
		</div>
	);
}
