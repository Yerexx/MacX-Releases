import { Code2, Keyboard, Settings2, SettingsIcon } from "lucide-react";
import type { SettingsSection } from "../../types/core/settings";

export const SETTINGS_STORAGE_KEY = "macx-settings";

export const SETTINGS_SECTIONS: SettingsSection[] = [
	{
		id: "editor",
		title: "Script Editor",
		description: "Fine-tune your coding experience with advanced editor settings",
		icon: Code2,
	},
	{
		id: "interface",
		title: "Interface & Theme",
		description: "Personalize MacX's appearance and visual experience",
		icon: SettingsIcon,
	},
	{
		id: "keybinds",
		title: "Keyboard Shortcuts",
		description: "Create custom hotkeys for lightning-fast workflow",
		icon: Keyboard,
	},
	{
		id: "application",
		title: "Application Settings",
		description: "Core MacX preferences and system information",
		icon: Settings2,
	},
] as const;

export const DEFAULT_EDITOR_SETTINGS = {
	display: {
		showLineNumbers: true,
		wordWrap: false,
		maxTokenizationLineLength: 20000,
		showMarkers: true,
	},
	text: {
		fontSize: 14,
		tabSize: 4,
		lineHeight: 1.5,
	},
	cursor: {
		style: "line" as const,
		blinking: "blink" as const,
		smoothCaret: true,
	},
	intellisense: {
		enabled: true,
		maxSuggestions: 5,
		acceptSuggestionKey: "Tab" as const,
		compactMode: false,
	},
	interface: {
		zenMode: false,
		showTabBar: false,
		showConsole: true,
		modalScale: "default" as const,
		middleClickTabClose: true,
		recentSearches: {
			enabled: true,
			maxItems: 5,
		},
		executionHistory: {
			maxItems: 100,
		},
		toastPosition: "bottom-center" as const,
		disableToasts: false,
	},
	app: {
		nightlyReleases: false,
	},
} as const;
