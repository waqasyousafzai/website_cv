import {
	createContext,
	type ReactNode,
	useCallback,
	useContext,
	useEffect,
	useRef,
	useState,
} from "react";
import { type SignalStatus, Toast } from "@/components/design";

export interface ToastInput {
	status?: SignalStatus;
	title?: string;
	message?: string;
}

interface ToastRecord extends ToastInput {
	id: number;
}

const DISMISS_AFTER = 4200;

const ToastContext = createContext<((t: ToastInput) => void) | null>(null);

/**
 * Queues a toast on the shell's stack. The stack lives in the `_app` layout
 * route, so any screen under it can raise one without prop-drilling a handler.
 */
export function useToast() {
	const push = useContext(ToastContext);
	if (!push) throw new Error("useToast must be called inside <ToastProvider>");
	return push;
}

let nextId = 0;

export function ToastProvider({ children }: { children: ReactNode }) {
	const [toasts, setToasts] = useState<ToastRecord[]>([]);
	const timers = useRef<number[]>([]);

	const dismiss = useCallback((id: number) => {
		setToasts((x) => x.filter((y) => y.id !== id));
	}, []);

	const push = useCallback(
		(t: ToastInput) => {
			const id = nextId++;
			setToasts((x) => [...x, { ...t, id }]);
			timers.current.push(window.setTimeout(() => dismiss(id), DISMISS_AFTER));
		},
		[dismiss],
	);

	useEffect(() => {
		const pending = timers.current;
		return () => {
			for (const t of pending) clearTimeout(t);
		};
	}, []);

	return (
		<ToastContext.Provider value={push}>
			{children}
			<div className="fixed right-s-8 bottom-s-9 z-80 flex flex-col gap-s-5">
				{toasts.map((t) => (
					<Toast
						key={t.id}
						message={t.message}
						onDismiss={() => dismiss(t.id)}
						status={t.status}
						title={t.title}
					/>
				))}
			</div>
		</ToastContext.Provider>
	);
}
