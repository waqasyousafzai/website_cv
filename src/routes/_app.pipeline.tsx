import { createFileRoute } from "@tanstack/react-router";
import { PipelineScreen } from "@/features/cv/PipelineScreen";

export const Route = createFileRoute("/_app/pipeline")({
	component: PipelineScreen,
});
