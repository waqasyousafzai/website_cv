import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

const mq = () =>
	typeof window === "undefined" ? null : (window.matchMedia?.(QUERY) ?? null);

const subscribe = (onChange: () => void) => {
	const m = mq();
	if (!m) return () => {};
	m.addEventListener("change", onChange);
	return () => m.removeEventListener("change", onChange);
};

const read = () => mq()?.matches ?? false;

/**
 * The motion preference as state, so a component can drop an effect from the
 * markup rather than only from the stylesheet — a tab stop on a scroll region
 * that only exists while the marquee is stopped, a paced reveal that has to
 * arrive whole. CSS handles everything that is purely an animation; this is for
 * the cases where the preference changes what is rendered.
 *
 * It tracks the preference live: the reduced-motion rules in `motion.css` do,
 * and a component that reads the same preference must not disagree with them
 * until the next reload.
 */
export function useReducedMotion() {
	// The server snapshot is `false` — no preference is knowable without a
	// window, and full motion is what the stylesheet assumes by default.
	return useSyncExternalStore(subscribe, read, () => false);
}
