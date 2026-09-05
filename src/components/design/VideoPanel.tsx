import {
	type CSSProperties,
	type HTMLAttributes,
	type SyntheticEvent,
	useEffect,
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
 * hairline progress track. With no `src` it renders its empty state rather than a black box.
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
	/** Fallback timecode string shown when there is no `src`, e.g. "01:12". */
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

export function VideoPanel({
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
	const [playing, setPlaying] = useState(autoPlay);
	const [at, setAt] = useState(0);
	const [len, setLen] = useState(0);
	// webm captures often report no duration until they have played through once,
	// so the furthest point reached stands in for the total until one arrives.
	const seen = useRef(0);
	const total = Number.isFinite(len) && len > 0 ? len : seen.current;
	const mark = (t: number) => {
		if (t > seen.current) seen.current = t;
		setAt(t);
	};
	useEffect(() => {
		const el = ref.current;
		setPlaying(src ? !!el && !el.paused : false);
	}, [src]);
	const toggle = () => {
		const el = ref.current;
		if (!el) return;
		if (el.paused) {
			el.play();
			setPlaying(true);
		} else {
			el.pause();
			setPlaying(false);
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
					{src ? `${tc(at)} / ${tc(total || Number.NaN)}` : duration || "--:--"}
				</span>
			</div>
			<div className="ds-video__frame" style={{ height }}>
				{src ? (
					<video
						autoPlay={autoPlay}
						className="ds-video__el"
						loop={loop}
						muted={muted}
						onDurationChange={readDuration}
						onLoadedMetadata={readDuration}
						onPause={() => setPlaying(false)}
						onPlay={() => setPlaying(true)}
						onPlaying={() => setPlaying(true)}
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
				{src && (
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
