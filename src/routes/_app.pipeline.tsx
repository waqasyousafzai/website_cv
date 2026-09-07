import { createFileRoute } from "@tanstack/react-router";
import { PipelineScreen } from "@/features/cv/PipelineScreen";

/** `?run=true` asks the screen to start a run as soon as it mounts. */
export interface PipelineSearch {
	run?: boolean;
}

export const Route = createFileRoute("/_app/pipeline")({
	component: PipelineScreen,
	// A match's search is its parent's merged with this result, and no route above
	// validates anything — so `run` has to be overwritten with `undefined` rather
	// than merely left out, or `?run=anything` would arrive as a truthy string and
	// start a run. The router parses `?run=true` to a boolean; the string form
	// covers a hand-typed URL.
	validateSearch: (search: Record<string, unknown>): PipelineSearch =>
		search.run === true || search.run === "true"
			? { run: true }
			: { run: undefined },
});
