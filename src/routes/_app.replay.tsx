import { createFileRoute } from "@tanstack/react-router";
import { ReplayScreen } from "@/features/cv/ReplayScreen";

export const Route = createFileRoute("/_app/replay")({
	component: ReplayScreen,
});
