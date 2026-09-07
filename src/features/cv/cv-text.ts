import { CV } from "./data";

/**
 * The CV as a downloadable plain-text file. Everything is read from `CV`, so the
 * download and the inspector panes never drift apart — there is no second copy
 * of the content to keep in sync.
 */

export const CV_FILENAME = "Waqas-Yousafzai-CV.txt";

const RULE = "=".repeat(64);

/** `## HEADING` in the same uppercase, spaced register the console uses. */
const heading = (title: string) => [`${RULE}`, title.toUpperCase(), RULE];

const bullet = (body: string) => `  ${body}`;

export function buildCvText(): string {
	const out: string[] = [];

	out.push(CV.name, `${CV.role} · ${CV.loc}`, "", CV.summary);

	out.push("", ...heading("Numbers"), "");
	for (const s of CV.stats) {
		const delta = s.delta ? `  (${s.delta})` : "";
		out.push(bullet(`${s.label}: ${s.value}${s.unit ?? ""}${delta}`));
	}

	out.push("", ...heading("Experience"));
	for (const e of CV.experience) {
		out.push("", `${e.when} · ${e.role}, ${e.org}`, bullet(e.body));
		if (e.tags?.length) out.push(bullet(`stack: ${e.tags.join(", ")}`));
	}

	out.push("", ...heading("Skills"), "");
	for (const s of CV.skills) {
		// The meter's 1–5 rating, written out rather than drawn.
		out.push(bullet(`${s.label}: ${s.value}/5 · ${s.level}`));
	}

	out.push("", ...heading("Projects"));
	for (const p of CV.projects) {
		out.push(
			"",
			`${p.name} (${p.kind})`,
			bullet(p.body),
			bullet(`stack: ${p.tags.join(", ")}`),
		);
	}

	out.push("", ...heading("Education"));
	for (const e of CV.education) {
		out.push("", `${e.when} · ${e.role}, ${e.org}`, bullet(e.body));
	}

	out.push("", ...heading("Contact"), "");
	for (const c of CV.contact) out.push(bullet(`${c.k}: ${c.v}`));

	return `${out.join("\n")}\n`;
}

/**
 * Writes the CV to the user's downloads as `Waqas-Yousafzai-CV.txt`. Returns the
 * byte size so the caller can report what actually landed rather than guess.
 */
export function downloadCvText(): number {
	const blob = new Blob([buildCvText()], {
		type: "text/plain;charset=utf-8",
	});
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = CV_FILENAME;
	a.rel = "noopener";
	document.body.append(a);
	a.click();
	a.remove();
	// Revoking synchronously can cut the download short in some browsers; the
	// click has been dispatched by the next tick.
	setTimeout(() => URL.revokeObjectURL(url), 0);
	return blob.size;
}
