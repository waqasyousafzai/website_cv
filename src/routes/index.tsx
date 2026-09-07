import { createFileRoute } from "@tanstack/react-router";
import { BootScreen } from "@/features/cv/BootScreen";

export const Route = createFileRoute("/")({ component: BootScreen });
