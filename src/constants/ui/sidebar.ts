import { Code2, Cog, BookOpen, Zap, Flag } from "lucide-react";
import type { SidebarItem } from "../../types/ui/sidebar";

export const MAIN_SCREENS: SidebarItem[] = [
	{ id: "Editor", icon: Code2, label: "Script Editor" },
	{ id: "Library", icon: BookOpen, label: "Script Hub" },
	{ id: "AutoExecution", icon: Zap, label: "Auto Execute" },
	{ id: "FastFlags", icon: Flag, label: "Performance" },
	{ id: "Settings", icon: Cog, label: "Preferences" },
] as const;

export const BUTTON_SPACING = 56 as const;

export const SIDEBAR_STORAGE_KEY = "macx-sidebar-visible" as const;
