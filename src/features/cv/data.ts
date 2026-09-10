import type { IconName, Level, SchemaColumn } from "@/components/design";

/**
 * `CV` is the owner's actual CV content and the single source for the inspector
 * panes and the text download. The stage records further down (`OUTPUT`,
 * `LOG_FOR`, `ROWS`) still carry demo narration and are not derived from it yet.
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
	/** Filled ticks on the meter, 1–5. Absent when the CV states no rating. */
	value?: number;
	/** Word for that rating, e.g. "daily driver". Absent alongside `value`. */
	level?: string;
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

/**
 * The whole record. Declared rather than inferred so an optional field an entry
 * omits — a stat with no unit, a skill with no rating — stays part of the type.
 */
export interface Cv {
	name: string;
	role: string;
	loc: string;
	summary: string;
	stats: CvStat[];
	experience: CvRole[];
	skills: CvSkill[];
	projects: CvProject[];
	education: CvRole[];
	contact: CvContact[];
	/** Illustrative pipeline columns for the demo, not CV facts. */
	schema: SchemaColumn[];
}

export const CV: Cv = {
	name: "Waqas Yousafzai",
	role: "AWS Data Engineer",
	loc: "Sydney, New South Wales",
	summary:
		"AWS Data Engineer with experience at a major UK bank, engineering production ETL pipelines that turn raw data into high-quality inputs for retail pricing decisions. Recently relocated to Sydney after travelling and seeking a new professional challenge.",
	// Both counts are scoped to the Aug 2024 — Jan 2026 role rather than being a
	// current inventory. The monetary figures stay qualified in the prose below.
	stats: [
		{ label: "Critical ETL pipelines delivered at NatWest", value: "4" },
		{ label: "Data engineering team supported by CI/CD", value: "5" },
	],
	experience: [
		{
			when: "Aug 2024 — Jan 2026",
			role: "Price Optimisation Manager (Senior Data Engineer)",
			org: "NatWest",
			body: "Based in London, United Kingdom. Led development for a $2M mortgage optimiser initiative, collaborating with Data & Analytics, Pricing and Finance on data products for mortgage interest-rate pricing. Finance forecast $17M in annual revenue from the delivered products. Engineered four critical AWS ETL pipelines using Glue for ingestion, EMR for Spark compute, S3 and Snowflake for storage, notebooks for exploratory data analysis, and Airflow for orchestration. Documented end-to-end data flows in Confluence with draw.io. Implemented GitLab CI/CD for integration testing, code validation and release management across a team of five data engineers. Maintained freshness, accuracy and reliability SLAs through resource optimisation, debugging and testing.",
			tags: [
				"AWS",
				"AWS Glue",
				"Amazon EMR",
				"Apache Spark",
				"Amazon S3",
				"Snowflake",
				"Apache Airflow",
				"GitLab",
				"CI/CD",
				"Confluence",
				"draw.io",
			],
		},
		{
			when: "Jul 2023 — Aug 2024",
			role: "Data and Analytics Engineer",
			org: "NatWest",
			body: "Based in London, United Kingdom. Built pricing pipelines and supported Snowflake setup and integration during migration from Teradata. Partnered with Finance and Pricing to build a what-if mortgage pricing scenario modelling KPI impacts, with projected annual revenue of $2M. Implemented AWS ETL workflows using Lambda, Glue, Step Functions and EventBridge according to compute, orchestration and cost requirements. Configured Snowflake RBAC with custom roles and least privilege. Improved queries, micro-partition pruning and warehouse sizing using query profiles and history. Used tagging for automated PII masking and team-level compute-cost attribution. Partnered with analysts on scheduled Snowflake ELT SQL tasks and presentation views for Tableau. Investigated pipeline and warehouse issues through deep dives and root cause analysis.",
			tags: [
				"AWS",
				"AWS Lambda",
				"AWS Glue",
				"AWS Step Functions",
				"Amazon EventBridge",
				"Snowflake",
				"Teradata",
				"SQL",
				"Tableau",
			],
		},
		{
			when: "Jun 2016 — Jul 2023",
			role: "Financial Trader (Data Scientist)",
			org: "Self-employed",
			body: "Based in Norwich, United Kingdom. Created trading strategies using machine learning and deep learning. The CV reports outperforming the S&P benchmark by 10% for three years and ranking among approximately the top 2% of retail traders. Developed profitable models using XGBoost, genetic algorithms, Bayesian optimisation, FP-Growth, KNN and Isolation Forest. Integrated Twitter sentiment analysis using NLP to add alternative data signals. Automated an Excel VBA risk-management calculator and trade logger.",
			tags: [
				"XGBoost",
				"Genetic algorithms",
				"Bayesian optimisation",
				"FP-Growth",
				"KNN",
				"Isolation Forest",
				"NLP",
				"Excel",
				"VBA",
			],
		},
	],
	// Listed in the CV's own order: cloud, devops, languages, visualization, soft
	// skills. It states no 1-5 ratings, so `value` and `level` are left absent
	// rather than scored from employment history.
	skills: [
		{ label: "AWS" },
		{ label: "Amazon EMR" },
		{ label: "Amazon EC2" },
		{ label: "AWS Glue" },
		{ label: "AWS Lambda" },
		{ label: "Apache Airflow (Amazon MWAA)" },
		{ label: "Amazon S3" },
		{ label: "Snowflake" },
		{ label: "GitLab" },
		{ label: "Version control" },
		{ label: "Branching" },
		{ label: "Pull requests" },
		{ label: "CI/CD pipelines" },
		{ label: "Agile" },
		{ label: "Python" },
		{ label: "SQL" },
		{ label: "PySpark" },
		{ label: "Scala" },
		{ label: "C++" },
		{ label: "VBA" },
		{ label: "Tableau" },
		{ label: "Matplotlib" },
		{ label: "Senior stakeholder management" },
		{ label: "Cross-functional collaboration" },
		{ label: "Data storytelling" },
		{ label: "Ownership mentality" },
	],
	// The CV names no separate projects; these group the work already described
	// in `experience`, so their outcomes are the same evidence, not extra wins.
	projects: [
		{
			name: "Mortgage pricing data products",
			kind: "Employment case study · NatWest",
			body: "Led development for a $2M mortgage optimiser initiative and delivered four critical AWS ETL pipelines supporting mortgage pricing. Finance forecast $17M in annual revenue from the delivered data products.",
			tags: [
				"AWS Glue",
				"Amazon EMR",
				"Apache Spark",
				"Amazon S3",
				"Snowflake",
				"Apache Airflow",
			],
		},
		{
			name: "Mortgage pricing what-if scenarios",
			kind: "Employment case study · NatWest",
			body: "Partnered with Finance and Pricing to model KPI impacts from hypothetical mortgage price changes. Implemented AWS ETL workflows for a scenario with projected annual revenue of $2M.",
			tags: [
				"AWS Lambda",
				"AWS Glue",
				"AWS Step Functions",
				"Amazon EventBridge",
			],
		},
		{
			name: "Machine-learning trading strategies",
			kind: "Self-employment case study",
			body: "Developed trading models with XGBoost, genetic algorithms, Bayesian optimisation and data-mining techniques. Integrated Twitter sentiment analysis and automated an Excel VBA risk-management calculator and trade logger.",
			tags: [
				"XGBoost",
				"Genetic algorithms",
				"Bayesian optimisation",
				"FP-Growth",
				"KNN",
				"Isolation Forest",
				"NLP",
				"Excel",
				"VBA",
			],
		},
	],
	education: [
		{
			when: "2015",
			role: "Biological Sciences (BSc)",
			org: "University of East Anglia",
			body: "Norwich, United Kingdom.",
		},
	],
	contact: [
		{ k: "email", v: "waqasyousafzai123@outlook.com", icon: "at-sign" },
		{
			k: "linkedin",
			v: "https://www.linkedin.com/in/waqas-yousafzai/",
			icon: "linkedin",
		},
		{ k: "phone", v: "0468 404 422", icon: "phone" },
	],
	schema: [
		{ name: "role_id", type: "bigint", key: true, note: "pk" },
		{ name: "employer", type: "varchar(120)" },
		{ name: "started_at", type: "date", note: "utc" },
		{ name: "ended_at", type: "date", note: "null = current" },
		{ name: "stack", type: "array<varchar>" },
		{ name: "impact_pct", type: "number(5,2)", note: "verified" },
	],
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
