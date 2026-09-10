import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

/** "1 row" / "3 rows" — a counter in the UI must never print "1 rows". */
export function count(n: number, one: string, many = `${one}s`) {
	return `${n} ${n === 1 ? one : many}`;
}
