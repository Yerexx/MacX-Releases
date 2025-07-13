import {
	History,
	LayoutGrid,
	MessageSquare,
	Palette,
	Settings as SettingsIcon,
	Monitor,
	Eye,
	Layout,
	RotateCcw,
	Zap
} from "lucide-react";
import { motion } from "motion/react";
import { type FC, useState } from "react";
import { toast } from "react-hot-toast";
import { useSettings } from "../../../hooks/core/useSettings";
import type { ToastPosition } from "../../../types/ui/toast";
import { Checkbox } from "../../ui/checkbox";
import { Modal } from "../../ui/modal";
import { RadioGroup } from "../../ui/radioGroup";
import { Slider } from "../../ui/slider";
import { SettingGroup } from "../settingGroup";

const TOAST_VERTICAL_OPTIONS = [
	{ value: "top", label: "Top" },
	{ value: "bottom", label: "Bottom" },
];

const TOAST_HORIZONTAL_OPTIONS = [
	{ value: "left", label: "Left" },
	{ value: "center", label: "Center" },
	{ value: "right", label: "Right" },
];

export const InterfaceSection: FC = () => {
	const { settings, updateSettings } = useSettings();
	const [showZenModeConfirm, setShowZenModeConfirm] = useState(false);

	const resetToDefaults = () => {
		updateSettings({
			interface: {
				...settings.interface,
				zenMode: false,
				showTooltips: true,
				animations: true,
				transparency: true,
				compactMode: false
			}
		});
		toast.success("Interface settings reset to defaults");
	};

	const handleZenModeToggle = () => {
		if (!settings.interface.zenMode) {
			setShowZenModeConfirm(true);
		} else {
			updateSettings({
				interface: {
					...settings.interface,
					zenMode: false,
				},
			});
			toast.success("Zen mode disabled", {
				id: "zen-mode-toast",
			});
		}
	};

	const confirmZenMode = () => {
		updateSettings({
			interface: {
				...settings.interface,
				zenMode: true,
			},
		});
		setShowZenModeConfirm(false);
		toast.success("Zen mode enabled", {
			id: "zen-mode-toast",
		});
	};

	const currentPosition = settings.interface.toastPosition || "bottom-center";
	const [vertical, horizontal] = currentPosition.split("-") as [string, string];

	const handleToastPositionChange = (
		type: "vertical" | "horizontal",
		value: string,
	) => {
		const newVertical = type === "vertical" ? value : vertical;
		const newHorizontal = type === "horizontal" ? value : horizontal;
		const newPosition = `${newVertical}-${newHorizontal}` as ToastPosition;

		updateSettings({
			interface: {
				...settings.interface,
				toastPosition: newPosition,
			},
		});
		toast.success("Toast position updated");
	};

	return (
		<div className="p-8 space-y-8">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h2 className="text-3xl font-bold text-white mb-2">Interface Settings</h2>
					<p className="text-slate-400 text-lg">Customize the look and feel of MacX</p>
				</div>
				<motion.button
					onClick={resetToDefaults}
					whileHover={{ scale: 1.05 }}
					whileTap={{ scale: 0.95 }}
					className="flex items-center gap-2 px-4 py-2 bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 hover:text-white rounded-xl transition-all duration-200 border border-slate-600/50"
				>
					<RotateCcw size={16} />
					Reset to Defaults
				</motion.button>
			</div>

			{/* Layout Settings */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.1 }}
				className="bg-slate-800/40 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/30"
			>
				<div className="flex items-center gap-3 mb-6">
					<div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
						<LayoutGrid size={20} className="text-white" />
					</div>
					<div>
						<h3 className="text-xl font-semibold text-white">Layout</h3>
						<p className="text-slate-400">Interface layout preferences</p>
					</div>
				</div>

				<div className="space-y-6">
					<Checkbox
						checked={settings.interface.zenMode}
						onChange={handleZenModeToggle}
						label="Zen Mode"
					description="Hide sidebar and tab bar for distraction-free coding"
				/>
				<Checkbox
					checked={settings.interface.showConsole}
					onChange={() => {
						updateSettings({
							interface: {
								...settings.interface,
								showConsole: !settings.interface.showConsole,
							},
						});
					}}
					label="Show Console"
					description="Display the Roblox console for logs and monitoring"
				/>
				</div>
			</motion.div>

			{/* Appearance Settings */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.2 }}
				className="bg-slate-800/40 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/30"
			>
				<div className="flex items-center gap-3 mb-6">
					<div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
						<Palette size={20} className="text-white" />
					</div>
					<div>
						<h3 className="text-xl font-semibold text-white">Appearance</h3>
						<p className="text-slate-400">Visual interface preferences</p>
					</div>
				</div>

				<div className="space-y-6">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<Checkbox
							checked={settings.interface.showTabBar}
							onChange={() => {
								updateSettings({
									interface: {
										...settings.interface,
										showTabBar: !settings.interface.showTabBar,
									},
								});
							}}
							label="Compact Tab Bar"
							description="Show only the current file name in a compact view"
						/>
						<Checkbox
							checked={settings.interface.middleClickTabClose}
							onChange={() => {
								updateSettings({
									interface: {
										...settings.interface,
										middleClickTabClose: !settings.interface.middleClickTabClose,
									},
								});
							}}
							label="Middle-Click Tab Close"
							description="Allow closing tabs by clicking the middle mouse button"
						/>
					</div>
					<RadioGroup
						value={settings.interface.modalScale}
						onChange={(value) => {
							updateSettings({
								interface: {
									...settings.interface,
									modalScale: value,
								},
							});
						}}
						options={[
							{ value: "small", label: "Small" },
							{ value: "default", label: "Default" },
							{ value: "large", label: "Large" },
						]}
						label="Modal Size"
						description="Adjust the size of modal windows and their content"
					/>
				</div>
			</motion.div>

				{/* History Settings */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.3 }}
				className="bg-slate-800/40 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/30"
			>
				<div className="flex items-center gap-3 mb-6">
					<div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
						<History size={20} className="text-white" />
					</div>
					<div>
						<h3 className="text-xl font-semibold text-white">History & Memory</h3>
						<p className="text-slate-400">Configure search and execution history</p>
					</div>
				</div>

				<div className="space-y-6">
					<Checkbox
						checked={settings.interface.recentSearches.enabled}
						onChange={() => {
							updateSettings({
								interface: {
									...settings.interface,
									recentSearches: {
										...settings.interface.recentSearches,
										enabled: !settings.interface.recentSearches.enabled,
									},
								},
							});
						}}
						label="Show Recent Searches"
						description="Display recent search history in the script library"
					/>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<Slider
							value={settings.interface.recentSearches.maxItems}
							onChange={(value) => {
								updateSettings({
									interface: {
										...settings.interface,
										recentSearches: {
											...settings.interface.recentSearches,
											maxItems: value,
										},
									},
								});
							}}
							min={1}
							max={10}
							step={1}
							label="Maximum Recent Searches"
							description="Number of recent searches to remember"
						/>
						<Slider
							value={settings.interface.executionHistory?.maxItems ?? 100}
							onChange={(value) => {
								updateSettings({
									interface: {
										...settings.interface,
										executionHistory: {
											...settings.interface.executionHistory,
											maxItems: value,
										},
									},
								});
							}}
							min={10}
							max={500}
							step={10}
							label="Maximum History Items"
							description="Number of execution records to keep in history"
						/>
					</div>
				</div>
			</motion.div>

				{/* Notifications Settings */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.4 }}
				className="bg-slate-800/40 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/30"
			>
				<div className="flex items-center gap-3 mb-6">
					<div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center">
						<MessageSquare size={20} className="text-white" />
					</div>
					<div>
						<h3 className="text-xl font-semibold text-white">Notifications</h3>
						<p className="text-slate-400">Configure toast notifications</p>
					</div>
				</div>

				<div className="space-y-6">
					<Checkbox
						checked={!settings.interface.disableToasts}
						onChange={() => {
							updateSettings({
								interface: {
									...settings.interface,
									disableToasts: !settings.interface.disableToasts,
								},
							});
						}}
						label="Show Notifications"
						description="Enable or disable toast notifications"
					/>
					{!settings.interface.disableToasts && (
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<RadioGroup
								value={vertical}
								onChange={(value) =>
									handleToastPositionChange("vertical", value)
								}
								options={TOAST_VERTICAL_OPTIONS}
								label="Vertical Position"
								description="Choose vertical alignment for toast notifications"
							/>
							<RadioGroup
								value={horizontal}
								onChange={(value) =>
									handleToastPositionChange("horizontal", value)
								}
								options={TOAST_HORIZONTAL_OPTIONS}
								label="Horizontal Position"
								description="Choose horizontal alignment for toast notifications"
							/>
						</div>
					)}
				</div>
			</motion.div>

			<Modal
				isOpen={showZenModeConfirm}
				onClose={() => setShowZenModeConfirm(false)}
				title="Enable Zen Mode"
				description="Zen Mode will hide the sidebar and tab bar for a distraction-free coding experience. You can toggle it back using the command palette (⌘+P) or keyboard shortcut (⌘+⇧+K)."
				onConfirm={confirmZenMode}
				confirmText="Enable"
			/>
		</div>
	);
};
