import { useState } from "react";
import {
	Badge,
	Card,
	Icon,
	Input,
	SchemaTable,
	SectionHeader,
	SkillMeter,
	Sparkline,
	Tag,
	TimelineEntry,
} from "@/components/design";
import { Button } from "@/components/ui/button";
import { CV, type PaneId } from "./data";
import { CountStat, useLiveSeries } from "./live";

const WRAP = "flex flex-col gap-s-7";

export interface PaneProps {
	/** Only the contact pane uses it — the dialog closes on send. */
	onSend?: () => void;
}

function Overview() {
	const series = useLiveSeries(40, 820);
	return (
		<div className={WRAP}>
			<SectionHeader index="FCT" note="one big row" title="Overview" />
			<p className="m-0 font-body text-muted">{CV.summary}</p>
			<div className="grid grid-cols-2 gap-s-5">
				{CV.stats.map((s) => (
					<CountStat key={s.label} {...s} />
				))}
			</div>
			<Card title="rows / minute · live">
				<Sparkline fill height={56} values={series} />
			</Card>
			<Card padded={false} title="fct_cv / schema">
				<SchemaTable columns={CV.schema} />
			</Card>
		</div>
	);
}

function Profile() {
	return (
		<div className={WRAP}>
			<SectionHeader index="01" note="1 row" title="Profile" />
			<div>
				<div className="font-display text-h4 text-ink-0">{CV.name}</div>
				<div className="mt-s-3 font-body-mono text-lime-500">
					{CV.role} · {CV.loc}
				</div>
			</div>
			<p className="m-0 font-body text-muted">{CV.summary}</p>
			<div className="flex flex-wrap gap-s-4">
				<Badge status="ok">available</Badge>
				<Badge status="idle">notice: 30d</Badge>
				<Badge status="idle">remote-first</Badge>
			</div>
		</div>
	);
}

function Experience() {
	return (
		<div className={WRAP}>
			<SectionHeader
				index="02"
				note={`${CV.experience.length} records`}
				title="Experience"
			/>
			<div>
				{CV.experience.map((e, i) => (
					<TimelineEntry
						key={e.role}
						last={i === CV.experience.length - 1}
						org={e.org}
						role={e.role}
						tags={e.tags?.map((t) => <Tag key={t}>{t}</Tag>)}
						when={e.when}
					>
						{e.body}
					</TimelineEntry>
				))}
			</div>
		</div>
	);
}

function Skills() {
	return (
		<div className={WRAP}>
			<SectionHeader index="03" note="ticks are honest" title="Skills" />
			<div className="flex min-w-0 flex-col gap-s-6">
				{CV.skills.map((s) => (
					<SkillMeter key={s.label} {...s} />
				))}
			</div>
		</div>
	);
}

function Projects() {
	return (
		<div className={WRAP}>
			<SectionHeader index="04" note="3 records" title="Projects" />
			{CV.projects.map((p) => (
				<Card key={p.name} notched title={`${p.name} / ${p.kind}`}>
					<p className="m-0 font-body text-muted">{p.body}</p>
					<div className="mt-s-5 flex flex-wrap gap-s-3">
						{p.tags.map((t) => (
							<Tag key={t}>{t}</Tag>
						))}
					</div>
				</Card>
			))}
		</div>
	);
}

function Education() {
	return (
		<div className={WRAP}>
			<SectionHeader index="05" note="2 records" title="Education" />
			<div>
				{CV.education.map((e, i) => (
					<TimelineEntry
						key={e.role}
						last={i === CV.education.length - 1}
						org={e.org}
						role={e.role}
						when={e.when}
					>
						{e.body}
					</TimelineEntry>
				))}
			</div>
		</div>
	);
}

function Contact({ onSend }: PaneProps) {
	const [sent, setSent] = useState(false);
	return (
		<div className={WRAP}>
			<SectionHeader index="06" note="endpoint open" title="Contact" />
			<div className="flex flex-col gap-s-4">
				{CV.contact.map((c) => (
					<div
						className="flex items-center gap-s-5 border border-hair bg-card px-s-5 py-s-4"
						key={c.k}
					>
						<span className="text-dim">
							<Icon name={c.icon} size={14} />
						</span>
						<span className="w-[64px] font-data text-dim uppercase tracking-label">
							{c.k}
						</span>
						<span className="font-body-mono text-ink-1">{c.v}</span>
					</div>
				))}
			</div>
			<Card title="POST /serve_contact">
				<div className="flex flex-col gap-s-5">
					<Input
						label="Your email"
						placeholder="you@company.com"
						prefix={<Icon name="at-sign" size={13} />}
					/>
					<Input
						label="Message"
						multiline
						placeholder="the role, the stack, the team"
						rows={3}
					/>
					<Button
						block
						leading={<Icon name="send" size={13} />}
						onClick={() => {
							setSent(true);
							onSend?.();
						}}
					>
						{sent ? "Queued" : "Send"}
					</Button>
				</div>
			</Card>
		</div>
	);
}

export const PANES: Record<PaneId, (props: PaneProps) => React.JSX.Element> = {
	overview: Overview,
	profile: Profile,
	experience: Experience,
	skills: Skills,
	projects: Projects,
	education: Education,
	contact: Contact,
};
