import type { TableHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface SchemaColumn {
	name: string;
	type: string;
	note?: string;
	/** Marks a key column. */
	key?: boolean;
}

/** Mono table describing a dataset's columns — used in stage inspectors and project write-ups. */
export interface SchemaTableProps
	extends TableHTMLAttributes<HTMLTableElement> {
	columns: SchemaColumn[];
}

export function SchemaTable({
	columns = [],
	className,
	...rest
}: SchemaTableProps) {
	return (
		<table className={cn("ds-schema", className)} {...rest}>
			<thead>
				<tr>
					<th>column</th>
					<th>type</th>
					<th>note</th>
				</tr>
			</thead>
			<tbody>
				{columns.map((c) => (
					<tr key={c.name}>
						<td>
							{c.key ? <span className="ds-schema__key">▸ </span> : null}
							{c.name}
						</td>
						<td className="ds-schema__type">{c.type}</td>
						<td className="text-dim">{c.note}</td>
					</tr>
				))}
			</tbody>
		</table>
	);
}
