import {
  Zap,
  SlidersHorizontal,
  Keyboard,
  Rewind,
  Pin,
  Layers,
  RefreshCw,
  MonitorPlay,
  Timer,
  PictureInPicture2,
  Focus,
  Volume2,
  EyeOff,
  ShieldCheck,
  HardDrive,
  ToggleRight,
  Minus,
  Plus,
  RotateCcw,
  FastForward,
  Eye,
  type LucideIcon,
} from "lucide-react";
import type { FeatureIconKey, ShortcutIconKey } from "@/lib/content";

/** One place mapping the plain string keys in lib/content.ts to real icon
 * components — keeps content.ts free of JSX/component imports. */
export const FEATURE_ICONS: Record<FeatureIconKey, LucideIcon> = {
  zap: Zap,
  sliders: SlidersHorizontal,
  keyboard: Keyboard,
  rewind: Rewind,
  pin: Pin,
  layers: Layers,
  refresh: RefreshCw,
  monitor: MonitorPlay,
  timer: Timer,
  pip: PictureInPicture2,
  focus: Focus,
  volume: Volume2,
};

export const PRIVACY_ICONS: LucideIcon[] = [EyeOff, ShieldCheck, HardDrive, ToggleRight];

export const SHORTCUT_ICONS: Record<ShortcutIconKey, LucideIcon> = {
  minus: Minus,
  plus: Plus,
  reset: RotateCcw,
  rewind: Rewind,
  forward: FastForward,
  eye: Eye,
};
