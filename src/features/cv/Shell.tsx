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
		<div className="flex w-rail flex-none flex-col items-center gap-s-5 border-hair border-r bg-void-1 py-s-5">
			<div className="font-display text-[14px] text-lime-500 text-glow">WY</div>
			<div className="h-px w-[24px] bg-line" />
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
			<div className="mt-auto flex flex-col gap-s-4">
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
		<div className="flex h-topbar flex-none items-center gap-s-7 border-hair border-b bg-void-1 px-s-7">
			<span className="font-display text-[13px] text-ink-0 tracking-display">
				WAQAS<span className="text-lime-500">.</span>YOUSAFZAI
			</span>
			<span className="font-data text-dim uppercase tracking-label">
				{breadcrumb}
			</span>
			<div className="ml-auto flex items-center gap-s-6">
				<Tooltip content="Warehouse throughput · last 44 min">
					<div className="flex w-[172px] items-center gap-s-5">
						<span className="flex-none font-data text-dim text-micro uppercase tracking-label">
							thrpt
						</span>
						<Sparkline fill height={20} values={series} />
					</div>
				</Tooltip>
				<div className="h-[20px] w-px bg-hair" />
				{right}
			</div>
		</div>
	);
}
