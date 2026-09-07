import {
	type CSSProperties,
	type HTMLAttributes,
	type SyntheticEvent,
	useRef,
	useState,
} from "react";
import { cn } from "@/lib/utils";

const pad = (n: number) => String(Math.floor(n)).padStart(2, "0");
const tc = (s: number) =>
	Number.isFinite(s) ? `${pad(s / 60)}:${pad(s % 60)}` : "--:--";

/**
 * A console-styled frame for moving footage — a screen capture of a run, a demo reel.
 * Chrome only: a mono header with a record dot and timecode, a scanline overlay, a
 * hairline progress track. Missing or failed recordings render the empty state.
 */
export interface VideoPanelProps extends HTMLAttributes<HTMLDivElement> {
	/** Video file URL. Omit to render the empty state. */
	src?: string;
	/** Still shown before playback. */
	poster?: string;
	/** Uppercase mono label in the header. Default "capture". */
	label?: string;
	/** One mono line under the frame. */
	caption?: string;
	/** Fallback timecode for missing or failed recordings, e.g. "01:12". */
	duration?: string;
	autoPlay?: boolean;
	/** Default true — captures loop; they are texture, not content. */
	loop?: boolean;
	/** Default true. Never ship an unmuted autoplaying panel. */
	muted?: boolean;
	/** CRT scanline overlay. Default true. */
	scanlines?: boolean;
	/** Cut the top-right / bottom-left corners. Default false. */
	notched?: boolean;
	/** Frame height in px. Default 220. */
	height?: number;
	/** Empty-state headline. Default "no capture attached". */
	emptyLabel?: string;
	/** Empty-state second line — say where to drop the file. */
	emptyHint?: string;
	className?: string;
	style?: CSSProperties;
}

export function VideoPanel(props: VideoPanelProps) {
	// Each recording owns its media element, timing, and failure state. A source
	// change also detaches the old ref before any pending play rejection settles.
	return <VideoPanelSession key={props.src} {...props} />;
}

function VideoPanelSession({
	src,
	poster,
	label = "capture",
	caption,
	duration,
	autoPlay = false,
	loop = true,
	muted = true,
	scanlines = true,
	notched = false,
	height = 220,
	emptyLabel = "no capture attached",
	emptyHint,
	className,
	style,
	...rest
}: VideoPanelProps) {
	const ref = useRef<HTMLVideoElement>(null);
	const [playing, setPlaying] = useState(false);
	const [failed, setFailed] = useState(false);
	const [at, setAt] = useState(0);
	const [len, setLen] = useState(0);
	const available = !!src && !failed;
	// webm captures often report no duration until they have played through once,
	// so the furthest point reached stands in for the total until one arrives.
	const seen = useRef(0);
	const total = Number.isFinite(len) && len > 0 ? len : seen.current;
	const mark = (t: number) => {
		if (t > seen.current) seen.current = t;
		setAt(t);
	};
	const fail = () => {
		setFailed(true);
		setPlaying(false);
		setAt(0);
		setLen(0);
		seen.current = 0;
	};
	const syncPlayback = (e: SyntheticEvent<HTMLVideoElement>) => {
		const el = e.currentTarget;
		setPlaying(!el.paused && !el.ended);
	};
	const toggle = async () => {
		const el = ref.current;
		if (!el) return;
		if (el.paused) {
			try {
				await el.play();
			} catch {
				if (ref.current !== el) return;
				// Policy blocks and interrupted requests can be retried. Only a
				// media error means the recording itself is unavailable.
				if (el.error) fail();
				else setPlaying(!el.paused && !el.ended);
			}
		} else {
			el.pause();
		}
	};
	const readDuration = (e: SyntheticEvent<HTMLVideoElement>) => {
		const d = e.currentTarget.duration;
		if (Number.isFinite(d) && d > 0) setLen(d);
	};
	const pct = total ? Math.min(100, (at / total) * 100) : 0;
	return (
		<div
			className={cn("ds-video", notched && "ds-video--notched", className)}
			style={style}
			{...rest}
		>
			<div className="ds-video__bar">
				<span
					className={cn("ds-video__dot", playing && "ds-video__dot--live")}
				/>
				<span className="ds-video__label">{label}</span>
				<span className="ds-video__tc">
					{available
						? `${tc(at)} / ${tc(total || Number.NaN)}`
						: duration || "--:--"}
				</span>
			</div>
			<div className="ds-video__frame" style={{ height }}>
				{available ? (
					<video
						autoPlay={autoPlay}
						className="ds-video__el"
						loop={loop}
						muted={muted}
						onDurationChange={readDuration}
						onEnded={syncPlayback}
						onError={fail}
						onLoadedMetadata={readDuration}
						onPause={syncPlayback}
						onPlay={syncPlayback}
						onPlaying={syncPlayback}
						onTimeUpdate={(e) => {
							readDuration(e);
							mark(e.currentTarget.currentTime);
						}}
						playsInline
						poster={poster}
						ref={ref}
						src={src}
					/>
				) : (
					<div className="ds-video__empty">
						<span className="ds-video__empty-line">{emptyLabel}</span>
						{emptyHint && (
							<span className="ds-video__empty-hint">{emptyHint}</span>
						)}
					</div>
				)}
				{scanlines && <div aria-hidden="true" className="ds-video__scan" />}
				{available && (
					<button
						aria-label={playing ? "Pause" : "Play"}
						className="ds-video__hit"
						onClick={toggle}
						type="button"
					>
						{!playing && <span className="ds-video__play">▸</span>}
					</button>
				)}
			</div>
			<div className="ds-video__foot">
				<div className="ds-video__track">
					<div className="ds-video__fill" style={{ width: `${pct}%` }} />
				</div>
				{caption && <span className="ds-video__caption">{caption}</span>}
			</div>
		</div>
	);
}
