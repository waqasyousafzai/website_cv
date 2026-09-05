import {
	AtSign,
	Box,
	Briefcase,
	Clapperboard,
	Contact,
	Download,
	FolderGit2,
	GitBranch,
	GraduationCap,
	Loader,
	type LucideIcon,
	Mail,
	Maximize,
	Phone,
	Play,
	Power,
	RotateCcw,
	Send,
	Settings,
	Table2,
	User,
	Wrench,
	Zap,
} from "lucide-react";
import type { CSSProperties } from "react";

/**
 * Lucide is the design system's only icon source, so this map is the whole
 * vocabulary — adding a glyph means adding it here, which keeps `name` a
 * checked union instead of an arbitrary string.
 *
 * `github` and `linkedin` are deliberate substitutions: Lucide removed its
 * brand marks in v0.469 for trademark reasons, and the design system's rule
 * against a second icon source outranks the brand recognition.
 */
const ICONS = {
	"at-sign": AtSign,
	box: Box,
	briefcase: Briefcase,
	clapperboard: Clapperboard,
	download: Download,
	"git-branch": GitBranch,
	github: FolderGit2,
	"graduation-cap": GraduationCap,
	linkedin: Contact,
	loader: Loader,
	mail: Mail,
	maximize: Maximize,
	phone: Phone,
	play: Play,
	power: Power,
	"rotate-ccw": RotateCcw,
	send: Send,
	settings: Settings,
	"table-2": Table2,
	user: User,
	wrench: Wrench,
	zap: Zap,
} satisfies Record<string, LucideIcon>;

export type IconName = keyof typeof ICONS;

export interface IconProps {
	/** Lucide icon id, kebab-case, e.g. "git-branch". */
	name: IconName;
	/** Pixel box. @default 16 */
	size?: number;
	/** @default 1.75 */
	strokeWidth?: number;
	color?: string;
	className?: string;
	style?: CSSProperties;
}

export function Icon({
	name,
	size = 16,
	strokeWidth = 1.75,
	color = "currentColor",
	className,
	style,
}: IconProps) {
	const Glyph = ICONS[name];
	return (
		<Glyph
			aria-hidden="true"
			className={className}
			color={color}
			size={size}
			strokeWidth={strokeWidth}
			style={{ display: "block", flex: "none", ...style }}
		/>
	);
}
