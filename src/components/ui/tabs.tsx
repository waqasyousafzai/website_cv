import { Tabs as TabsPrimitive } from "radix-ui";
import type * as React from "react";
import { cn } from "@/lib/utils";

// Generated with `shadcn add tabs`, then restyled onto `ds-tabs` / `ds-tab` and
// narrowed to the design system's controlled items/value/onChange API. The
// panels are rendered by the caller, so this is a tab strip: Radix supplies the
// roving arrow-key focus and the tablist roles the prototype's buttons lacked.
export interface TabItem {
	id: string;
	label: React.ReactNode;
}

export interface TabsProps
	extends Omit<
		React.ComponentProps<typeof TabsPrimitive.List>,
		"onChange" | "defaultValue"
	> {
	items: TabItem[];
	/** Active item id. */
	value: string;
	onChange?: (id: string) => void;
}

function Tabs({ items, value, onChange, className, ...props }: TabsProps) {
	return (
		<TabsPrimitive.Root
			data-slot="tabs"
			onValueChange={onChange}
			// Without panels the strip is navigation, so activate on focus rather
			// than making every arrow key press need a second Enter.
			activationMode="automatic"
			value={value}
		>
			<TabsPrimitive.List
				className={cn("ds-tabs", className)}
				data-slot="tabs-list"
				{...props}
			>
				{items.map((it) => (
					<TabsPrimitive.Trigger
						className={cn("ds-tab", it.id === value && "ds-tab--active")}
						data-slot="tabs-trigger"
						key={it.id}
						value={it.id}
					>
						{it.label}
					</TabsPrimitive.Trigger>
				))}
			</TabsPrimitive.List>
		</TabsPrimitive.Root>
	);
}

export { Tabs };
