import type { IconName, Level, SchemaColumn } from "@/components/design";

/**
 * Every value the CV renders. Placeholder content — replace with the real CV.
 * Nothing here is fetched, which is why the app carries no query client.
 */

export interface CvStat {
	label: string;
	value: string;
	unit?: string;
	delta?: string;
}

export interface CvRole {
	when: string;
	role: string;
	org: string;
	body: string;
	tags?: string[];
}

export interface CvSkill {
	label: string;
	value: number;
	level: string;
}

export interface CvProject {
	name: string;
	kind: string;
	body: string;
	tags: string[];
}

export interface CvContact {
	k: string;
	v: string;
	icon: IconName;
}

export const CV = {
	name: "WAQAS YOUSAFZAI",
	role: "Data Engineer",
	loc: "Sydney, Australia",
	summary:
		"I build ingestion and transformation systems that stay boring under load. Six years across streaming and batch: Kafka to warehouse, dbt models, orchestration that pages nobody at 3am.",
	stats: [
		{ label: "Rows / day", value: "1.2", unit: "B", delta: "+18% qoq" },
		{ label: "On-time delivery", value: "99.98", unit: "%" },
		{ label: "Pipelines owned", value: "41" },
		{ label: "Years", value: "6" },
	] satisfies CvStat[],
	experience: [
		{
			when: "2022 — present",
			role: "Senior Data Engineer",
			org: "Acme Data Platform",
			body: "Own the ingest layer: 180 Kafka topics into Snowflake. Rebuilt the loader; nightly runtime 6h to 40m and on-call pages down 70%.",
			tags: ["Kafka", "Snowflake", "Airflow", "dbt", "Terraform"],
		},
		{
			when: "2020 — 2022",
			role: "Data Engineer",
			org: "Northwind Logistics",
			body: "Built the warehouse from scratch: 90 dbt models, contract tests on every source, freshness SLAs published to the business.",
			tags: ["dbt", "BigQuery", "Python", "Dagster"],
		},
		{
			when: "2019 — 2020",
			role: "Analytics Engineer",
			org: "Vertex Retail",
			body: "Replaced 40 hand-run SQL scripts with a scheduled DAG and a tested semantic layer.",
			tags: ["Airflow", "Postgres", "Looker"],
		},
	] satisfies CvRole[],
	skills: [
		{ label: "Airflow", value: 5, level: "daily driver" },
		{ label: "dbt", value: 5, level: "daily driver" },
		{ label: "Snowflake", value: 5, level: "daily driver" },
		{ label: "Python", value: 5, level: "daily driver" },
		{ label: "Kafka", value: 4, level: "production" },
		{ label: "Spark", value: 3, level: "production" },
		{ label: "Terraform", value: 3, level: "production" },
		{ label: "Kubernetes", value: 2, level: "working" },
	] satisfies CvSkill[],
	projects: [
		{
			name: "topic_to_table",
			kind: "open source",
			body: "Declarative Kafka-to-warehouse loader. Schema drift handling, exactly-once landing, 1.2B rows/day in production.",
			tags: ["Python", "Kafka", "Snowflake"],
		},
		{
			name: "dq_contracts",
			kind: "internal",
			body: "Source contract tests generated from dbt schema files; blocks a release when a producer breaks a column.",
			tags: ["dbt", "Great Expectations"],
		},
		{
			name: "cost_lens",
			kind: "internal",
			body: "Warehouse spend attribution per model. Found and cut 38% of nightly compute.",
			tags: ["Snowflake", "Streamlit"],
		},
	] satisfies CvProject[],
	education: [
		{
			when: "2015 — 2019",
			role: "BSc Computer Science",
			org: "NUST",
			body: "Databases, distributed systems, numerical methods.",
		},
		{
			when: "2023",
			role: "SnowPro Advanced: Data Engineer",
			org: "Snowflake",
			body: "Certification.",
		},
	] satisfies CvRole[],
	contact: [
		{ k: "email", v: "waqas@example.com", icon: "at-sign" },
		{ k: "github", v: "github.com/waqas", icon: "github" },
		{ k: "linkedin", v: "in/waqas-yousafzai", icon: "linkedin" },
		{ k: "phone", v: "+92 300 000 0000", icon: "phone" },
	] satisfies CvContact[],
	schema: [
		{ name: "role_id", type: "bigint", key: true, note: "pk" },
		{ name: "employer", type: "varchar(120)" },
		{ name: "started_at", type: "date", note: "utc" },
		{ name: "ended_at", type: "date", note: "null = current" },
		{ name: "stack", type: "array<varchar>" },
		{ name: "impact_pct", type: "number(5,2)", note: "verified" },
	] satisfies SchemaColumn[],
};

export type PaneId =
	| "overview"
	| "profile"
	| "experience"
	| "skills"
	| "projects"
	| "education"
	| "contact";

export interface StageNode {
	id: string;
	label: string;
	kind: string;
	icon: IconName;
	x: number;
	y: number;
	pane: PaneId;
}

export const NODES = [
	{
		id: "src_profile",
		label: "src_profile",
		kind: "source / identity",
		icon: "user",
		x: 24,
		y: 28,
		pane: "profile",
	},
	{
		id: "src_experience",
		label: "src_experience",
		kind: "source / roles",
		icon: "briefcase",
		x: 24,
		y: 132,
		pane: "experience",
	},
	{
		id: "src_skills",
		label: "src_skills",
		kind: "source / tools",
		icon: "wrench",
		x: 24,
		y: 236,
		pane: "skills",
	},
	{
		id: "stg_projects",
		label: "stg_projects",
		kind: "dbt model",
		icon: "git-branch",
		x: 248,
		y: 80,
		pane: "projects",
	},
	{
		id: "stg_education",
		label: "stg_education",
		kind: "dbt model",
		icon: "graduation-cap",
		x: 248,
		y: 184,
		pane: "education",
	},
	{
		id: "fct_cv",
		label: "fct_cv",
		kind: "table / one big row",
		icon: "table-2",
		x: 472,
		y: 132,
		pane: "overview",
	},
	{
		id: "serve_contact",
		label: "serve_contact",
		kind: "api endpoint",
		icon: "zap",
		x: 696,
		y: 132,
		pane: "contact",
	},
] as const satisfies readonly StageNode[];

export type NodeId = (typeof NODES)[number]["id"];

export const EDGES: ReadonlyArray<{ from: NodeId; to: NodeId }> = [
	{ from: "src_profile", to: "stg_projects" },
	{ from: "src_experience", to: "stg_projects" },
	{ from: "src_experience", to: "stg_education" },
	{ from: "src_skills", to: "stg_education" },
	{ from: "stg_projects", to: "fct_cv" },
	{ from: "stg_education", to: "fct_cv" },
	{ from: "fct_cv", to: "serve_contact" },
];

export const RUN_ORDER: readonly NodeId[] = [
	"src_profile",
	"src_experience",
	"src_skills",
	"stg_projects",
	"stg_education",
	"fct_cv",
	"serve_contact",
];

/** Per-stage log lines: the first is emitted on entry, the last on completion. */
export const LOG_FOR: Record<NodeId, ReadonlyArray<[Level, string]>> = {
	src_profile: [
		["info", "reading identity from src_profile"],
		["ok", "1 row · waqas yousafzai / data engineer"],
	],
	src_experience: [
		["info", "scanning src_experience"],
		["ok", "3 roles · 6.2 years total tenure"],
	],
	src_skills: [
		["info", "scanning src_skills"],
		["ok", "24 tools · 8 at production depth"],
	],
	stg_projects: [
		["info", "stg_projects: normalizing project records"],
		["ok", "3 projects materialized"],
	],
	stg_education: [
		["info", "stg_education: joining certifications"],
		["warn", "1 cert expires 2027 — refresh reminder set"],
	],
	fct_cv: [
		["info", "fct_cv: building one big row"],
		["ok", "fct_cv materialized in 1.4s"],
	],
	serve_contact: [
		["info", "serve_contact: opening endpoint"],
		["ok", "ready · accepting offers"],
	],
};

/** What each stage shows in its in-canvas callout. */
export const OUTPUT: Record<
	NodeId,
	{ head: string; lines: ReadonlyArray<[string, string]> }
> = {
	src_profile: {
		head: "identity record",
		lines: [
			["name", "Waqas Yousafzai"],
			["role", "Data Engineer"],
			["based", "Sydney, Australia"],
			["status", "available · 30d notice"],
		],
	},
	src_experience: {
		head: "3 roles · 6.2 years",
		lines: [
			["2022 —", "Senior Data Engineer · Acme Data Platform"],
			["2020 — 2022", "Data Engineer · Northwind Logistics"],
			["2019 — 2020", "Analytics Engineer · Vertex Retail"],
		],
	},
	src_skills: {
		head: "24 tools · 8 at production depth",
		lines: [
			["daily driver", "Airflow, dbt, Snowflake, Python"],
			["production", "Kafka, Spark, Terraform"],
			["working", "Kubernetes, Flink"],
		],
	},
	stg_projects: {
		head: "3 projects materialized",
		lines: [
			["topic_to_table", "kafka → warehouse loader, 1.2B rows/day"],
			["dq_contracts", "source contract tests from dbt schemas"],
			["cost_lens", "spend attribution; cut 38% of nightly compute"],
		],
	},
	stg_education: {
		head: "2 records · 1 warn",
		lines: [
			["2015 — 2019", "BSc Computer Science · NUST"],
			["2023", "SnowPro Advanced: Data Engineer"],
			["warn", "1 cert expires 2027"],
		],
	},
	fct_cv: {
		head: "one big row",
		lines: [
			["rows / day", "1.2B"],
			["on-time delivery", "99.98%"],
			["pipelines owned", "41"],
			["years", "6"],
		],
	},
	serve_contact: {
		head: "200 OK · accepting offers",
		lines: [
			["email", "waqas@example.com"],
			["github", "github.com/waqas"],
			["linkedin", "in/waqas-yousafzai"],
			["phone", "+92 300 000 0000"],
		],
	},
};

/** Row counts a stage reports once it has been built. */
export const ROWS: Record<NodeId, string> = {
	src_profile: "1 row",
	src_experience: "3 rows",
	src_skills: "24 rows",
	stg_projects: "3 rows",
	stg_education: "2 rows",
	fct_cv: "1 row",
	serve_contact: "200 OK",
};
