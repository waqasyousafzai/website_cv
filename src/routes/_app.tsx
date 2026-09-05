import { createFileRoute, Outlet } from "@tanstack/react-router";
import { useState } from "react";
import { Badge, Icon } from "@/components/design";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { TooltipProvider } from "@/components/ui/tooltip";
import { PANES } from "@/features/cv/Panes";
import { Rail, TopBar } from "@/features/cv/Shell";
import { ToastProvider, useToast } from "@/features/cv/toast-context";

export const Route = createFileRoute("/_app")({ component: AppLayout });

/**
 * The console shell: rail, topbar, toast stack and the contact dialog. It is a
 * pathless layout route, so every view under it keeps its own URL while sharing
 * one instance of the chrome.
 */
function AppLayout() {
	const [contact, setContact] = useState(false);
	const open = () => setContact(true);
	return (
		<TooltipProvider>
			<ToastProvider>
				<div className="flex h-full bg-void-0">
					<Rail onContact={open} />
					<div className="flex min-w-0 flex-1 flex-col">
						<TopBar
							right={
								<>
									<Badge status="ok">available</Badge>
									<Button
										leading={<Icon name="mail" size={12} />}
										onClick={open}
										size="sm"
										variant="secondary"
									>
										Contact
									</Button>
								</>
							}
						/>
						<Outlet />
					</div>
				</div>
				<ContactDialog onOpenChange={setContact} open={contact} />
			</ToastProvider>
		</TooltipProvider>
	);
}

function ContactDialog({
	open,
	onOpenChange,
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}) {
	const push = useToast();
	const Contact = PANES.contact;
	return (
		<Dialog onOpenChange={onOpenChange} open={open}>
			<DialogContent title="serve_contact">
				<Contact
					onSend={() => {
						onOpenChange(false);
						push({
							status: "ok",
							title: "Message queued",
							message: "serve_contact: 202 accepted",
						});
					}}
				/>
			</DialogContent>
		</Dialog>
	);
}
