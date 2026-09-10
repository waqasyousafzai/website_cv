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
import { count } from "@/lib/utils";
import { CV, type PaneId, SKILL_GROUPS, type SkillGroup } from "./data";
import { CvStats, useLiveSeries } from "./live";

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
			<CvStats />
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
				<Badge status="ok">{CV.status}</Badge>
			</div>
		</div>
	);
}

function Experience() {
	return (
		<div className={WRAP}>
			<SectionHeader
				index="02"
				note={count(CV.experience.length, "record")}
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

/**
 * One of the CV's skill categories. The CV states no 1-5 ratings, so an unscored
 * skill is a plain chip rather than a meter drawn at zero; a skill that does
 * carry a rating still gets its meter.
 */
function SkillGroupSection({ group }: { group: SkillGroup }) {
	const unscored = group.skills.filter((s) => s.value === undefined);
	const scored = group.skills.filter((s) => s.value !== undefined);
	return (
		<div className="flex min-w-0 flex-col gap-s-5">
			<div className="font-data text-dim uppercase tracking-label">
				{group.category}
			</div>
			{unscored.length > 0 && (
				<div className="flex flex-wrap gap-s-3">
					{unscored.map((s) => (
						<Tag key={s.label}>{s.label}</Tag>
					))}
				</div>
			)}
			{scored.map((s) => (
				<SkillMeter
					key={s.label}
					label={s.label}
					level={s.level}
					value={s.value}
				/>
			))}
		</div>
	);
}

function Skills() {
	return (
		<div className={WRAP}>
			<SectionHeader
				index="03"
				note={count(CV.skills.length, "skill")}
				title="Skills"
			/>
			<div className="flex min-w-0 flex-col gap-s-7">
				{SKILL_GROUPS.map((g) => (
					<SkillGroupSection group={g} key={g.category} />
				))}
			</div>
		</div>
	);
}

function Projects() {
	return (
		<div className={WRAP}>
			<SectionHeader
				index="04"
				note={count(CV.projects.length, "record")}
				title="Projects"
			/>
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
			<SectionHeader
				index="05"
				note={count(CV.education.length, "record")}
				title="Education"
			/>
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
						<span className="flex-none text-dim">
							<Icon name={c.icon} size={14} />
						</span>
						<span className="w-[64px] flex-none font-data text-dim uppercase tracking-label">
							{c.k}
						</span>
						{/* A real address or profile URL outruns the 340px inspector, so the
						    value wraps mid-token rather than pushing the pane sideways. */}
						<span className="min-w-0 font-body-mono text-ink-1 wrap-anywhere">
							{c.v}
						</span>
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
