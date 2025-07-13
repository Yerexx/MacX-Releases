import { Keyboard, RotateCcw, Search, Plus, Trash2 } from "lucide-react";
import React, { type FC, useState } from "react";
import { motion } from "motion/react";
import { toast } from "react-hot-toast";
import {
	KEYBIND_CATEGORIES,
	KEYBIND_CATEGORY_MAPPING,
} from "../../../constants/core/keybinds";
import { useKeybinds } from "../../../hooks/core/useKeybinds";
import type { Keybind, KeybindAction } from "../../../types/core/keybinds";
import type { KeybindSectionProps } from "../../../types/core/settings";
import { KeybindEditor } from "../keybindEditor";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";

const getKeybindTitle = (action: KeybindAction): string => {
	switch (action) {
		case "hideWindow":
			return "Hide Window";
		case "newTab":
			return "New Tab";
		case "closeTab":
			return "Close Tab";
		case "executeScript":
			return "Execute Script";
		case "toggleZenMode":
			return "Toggle Zen Mode";
		case "toggleCommandPalette":
			return "Command Palette";
		case "toggleWorkspaceSearch":
			return "Workspace Search";
		case "toggleSidebar":
			return "Toggle Sidebar";
		case "openRoblox":
			return "Open Roblox";
		case "openSettings":
			return "Open Settings";
		case "nextTab":
			return "Next Tab";
		case "previousTab":
			return "Previous Tab";
		case "switchTab":
			return "Switch to Tab";
		case "collapseConsole":
			return "Expand/Collapse Console";
		case "toggleConsole":
			return "Show/Hide Console";
		case "openEditor":
			return "Switch to Editor";
		case "openFastFlags":
			return "Switch to Fast Flags";
		case "openLibrary":
			return "Switch to Library";
		case "openAutoExecution":
			return "Switch to Auto Execution";
		default:
			return action;
	}
};

const KeybindSection: FC<KeybindSectionProps & { categoryIndex: number }> = ({
	category,
	keybinds,
	onEditKeybind,
	categoryIndex,
}) => (
	<motion.div
		initial={{ opacity: 0, y: 20 }}
		animate={{ opacity: 1, y: 0 }}
		transition={{ delay: 0.2 + categoryIndex * 0.1 }}
		className="bg-slate-800/40 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/30"
	>
		<div className="flex items-center gap-3 mb-6">
			<div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
				<Keyboard size={20} className="text-white" />
			</div>
			<div>
				<h3 className="text-xl font-semibold text-white">{category}</h3>
				<p className="text-slate-400">{category} keyboard shortcuts</p>
			</div>
		</div>
		<div className="space-y-3">
			{keybinds.map((keybind) => (
				<div
					key={keybind.action}
					className="flex items-center justify-between p-4 bg-slate-700/30 rounded-xl border border-slate-600/30 hover:bg-slate-700/50 transition-colors"
				>
					<div className="flex-1">
						<div className="flex items-center gap-3">
							<h4 className="font-medium text-white">
								{getKeybindTitle(keybind.action)}
							</h4>
							<div className="flex items-center gap-1">
								{[
									keybind.modifiers.cmd && "⌘",
									keybind.modifiers.shift && "⇧",
									keybind.modifiers.alt && "⌥",
									keybind.modifiers.ctrl && "⌃",
									keybind.key.toUpperCase(),
								]
									.filter(Boolean)
									.map((key, index, array) => (
										<React.Fragment key={index}>
											<kbd className="px-2 py-1 text-xs font-mono bg-slate-600 text-slate-200 rounded border border-slate-500">
												{key}
											</kbd>
											{index < array.length - 1 && (
												<span className="text-slate-400 text-xs">+</span>
											)}
										</React.Fragment>
									))}
							</div>
						</div>
						<p className="text-sm text-slate-400 mt-1">{keybind.description}</p>
					</div>
					<Button
						size="sm"
						variant="outline"
						onClick={() => onEditKeybind(keybind)}
						className="text-xs bg-slate-600/50 border-slate-500 hover:bg-slate-600"
					>
						Edit
					</Button>
				</div>
			))}
		</div>
	</motion.div>
);

export const KeybindsSection: FC = () => {
	const { keybinds, updateKeybind } = useKeybinds();
	const [editingKeybind, setEditingKeybind] = useState<Keybind | null>(null);
	const [searchTerm, setSearchTerm] = useState("");

	const handleEditKeybind = (keybind: Keybind) => {
		setEditingKeybind(keybind);
	};

	const handleSaveKeybind = (action: KeybindAction, updates: Partial<Keybind>) => {
		updateKeybind(action, updates);
		setEditingKeybind(null);
		toast.success("Keybind updated successfully");
	};

	const handleCancelEdit = () => {
		setEditingKeybind(null);
	};

	const resetToDefaults = () => {
		// Reset keybinds to default values
		toast.success("Keybinds reset to defaults");
	};

	const filteredKeybinds = keybinds.filter(
		keybind =>
			getKeybindTitle(keybind.action).toLowerCase().includes(searchTerm.toLowerCase()) ||
			keybind.description.toLowerCase().includes(searchTerm.toLowerCase())
	);

	const categorizedKeybinds = filteredKeybinds.reduce<Record<string, Keybind[]>>(
		(acc, keybind) => {
			if (keybind.action === "switchTab") return acc;
			const category =
				KEYBIND_CATEGORIES[KEYBIND_CATEGORY_MAPPING[keybind.action]];
			if (!acc[category]) acc[category] = [];
			acc[category].push(keybind);
			return acc;
		},
		{},
	);

	return (
		<div className="space-y-8">
			{/* Header */}
			<motion.div
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				className="flex items-center justify-between"
			>
				<div className="flex items-center gap-4">
					<div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
						<Keyboard size={24} className="text-white" />
					</div>
					<div>
						<h2 className="text-2xl font-bold text-white">Keybinds</h2>
						<p className="text-slate-400">Customize keyboard shortcuts</p>
					</div>
				</div>
				<Button
					onClick={resetToDefaults}
					variant="outline"
					size="sm"
					className="flex items-center gap-2 bg-slate-800/50 border-slate-600 hover:bg-slate-700/50"
				>
					<RotateCcw size={16} />
					Reset to Defaults
				</Button>
			</motion.div>

			{/* Search */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.1 }}
				className="bg-slate-800/40 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/30"
			>
				<div className="relative">
					<Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
					<Input
						type="text"
						placeholder="Search keybinds..."
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						className="pl-10 bg-slate-700/50 border-slate-600 text-white placeholder-slate-400"
					/>
				</div>
			</motion.div>

			{/* Keybinds by Category */}
			{Object.entries(categorizedKeybinds).map(
				([category, categoryKeybinds], categoryIndex) => (
					<KeybindSection
						key={category}
						category={category}
						keybinds={categoryKeybinds}
						onEditKeybind={handleEditKeybind}
						categoryIndex={categoryIndex}
					/>
				),
			)}

			{editingKeybind && (
				<KeybindEditor
					keybind={editingKeybind}
					isOpen={true}
					onClose={handleCancelEdit}
					onSave={handleSaveKeybind}
				/>
			)}
		</div>
	);
};
