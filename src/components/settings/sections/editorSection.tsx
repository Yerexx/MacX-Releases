import { Code2, Monitor, MousePointer2, Sparkles, Type, RotateCcw, Palette, Zap } from "lucide-react";
import { motion } from "motion/react";
import type { FC } from "react";
import { useSettings } from "../../../hooks/core/useSettings";
import type { SettingsKey } from "../../../types/core/settings";
import { Checkbox } from "../../ui/checkbox";
import { RadioGroup } from "../../ui/radioGroup";
import { Slider } from "../../ui/slider";
import { SettingGroup } from "../settingGroup";

export const EditorSection: FC = () => {
	const { settings, updateSettings } = useSettings();

	const handleSliderChange = (
		key: SettingsKey,
		subKey: string,
		value: number,
	) => {
		const currentSettings = settings[key] as Record<string, unknown>;
		updateSettings({
			[key]: {
				...currentSettings,
				[subKey]: value,
			},
		});
	};

	const resetToDefaults = () => {
		// Reset all editor settings to defaults
		updateSettings({
			display: {
				showLineNumbers: true,
				showMinimap: true,
				wordWrap: true,
				fontSize: 14,
				fontFamily: "JetBrains Mono",
				theme: "dark"
			},
			behavior: {
				autoSave: true,
				formatOnSave: false,
				tabSize: 4
			}
		});
	};

	return (
		<div className="p-8 space-y-8">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h2 className="text-3xl font-bold text-white mb-2">Editor Settings</h2>
					<p className="text-slate-400 text-lg">Customize your coding environment</p>
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

			{/* Font & Typography Settings */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.1 }}
				className="bg-slate-800/40 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/30"
			>
				<div className="flex items-center gap-3 mb-6">
					<div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
						<Type size={20} className="text-white" />
					</div>
					<div>
						<h3 className="text-xl font-semibold text-white">Font & Typography</h3>
						<p className="text-slate-400">Configure text appearance</p>
					</div>
				</div>

				<div className="space-y-6">
					{/* Font Size */}
					<div>
						<label className="block text-sm font-medium text-slate-300 mb-3">
							Font Size: {settings.display.fontSize}px
						</label>
						<Slider
							value={settings.display.fontSize}
							onChange={(value) => handleSliderChange("display", "fontSize", value)}
							min={10}
							max={24}
							step={1}
							className="w-full"
						/>
						<div className="flex justify-between text-xs text-slate-500 mt-1">
							<span>10px</span>
							<span>24px</span>
						</div>
					</div>
				</div>
			</motion.div>

			{/* Display Settings */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.2 }}
				className="bg-slate-800/40 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/30"
			>
				<div className="flex items-center gap-3 mb-6">
					<div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
						<Monitor size={20} className="text-white" />
					</div>
					<div>
						<h3 className="text-xl font-semibold text-white">Display Options</h3>
						<p className="text-slate-400">Visual editor preferences</p>
					</div>
				</div>

				<div className="space-y-4">
					<Checkbox
						checked={settings.display.showLineNumbers}
						onChange={() => {
							updateSettings({
								display: {
									...settings.display,
									showLineNumbers: !settings.display.showLineNumbers,
								},
							});
						}}
						label="Show line numbers"
						description="Display line numbers in the gutter"
					/>
					<Checkbox
						checked={settings.display.wordWrap}
						onChange={() => {
							updateSettings({
								display: {
									...settings.display,
									wordWrap: !settings.display.wordWrap,
								},
							});
						}}
						label="Word wrap"
						description="Wrap long lines to fit editor width"
					/>
					<Checkbox
						checked={settings.display.showMarkers}
						onChange={() => {
							updateSettings({
								display: {
									...settings.display,
									showMarkers: !settings.display.showMarkers,
								},
							});
						}}
						label="Show error markers"
						description="Display error and warning markers in the editor"
					/>
				</div>
			</motion.div>

			{/* Text & Spacing Settings */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.3 }}
				className="bg-slate-800/40 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/30"
			>
				<div className="flex items-center gap-3 mb-6">
					<div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
						<Code2 size={20} className="text-white" />
					</div>
					<div>
						<h3 className="text-xl font-semibold text-white">Text & Spacing</h3>
						<p className="text-slate-400">Font and spacing preferences</p>
					</div>
				</div>

				<div className="space-y-6">
					<Slider
						value={settings.text.tabSize}
						onChange={(value) => handleSliderChange("text", "tabSize", value)}
						min={2}
						max={8}
						label="Tab size"
						description="Number of spaces for indentation"
						unit=" spaces"
					/>
					<Slider
						value={settings.text.lineHeight}
						onChange={(value) =>
							handleSliderChange("text", "lineHeight", value)
						}
						min={1}
						max={2}
						step={0.1}
						label="Line height"
						description="Space between lines"
						unit="x"
					/>
					<Slider
						value={settings.display.maxTokenizationLineLength}
						onChange={(value) =>
							handleSliderChange("display", "maxTokenizationLineLength", value)
						}
						min={20000}
						max={40000}
						step={1000}
						label="Max Line Length"
						description="Maximum line length for syntax highlighting (higher values may impact performance)"
						unit=" chars"
					/>
				</div>
			</motion.div>

			{/* Cursor Settings */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.4 }}
				className="bg-slate-800/40 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/30"
			>
				<div className="flex items-center gap-3 mb-6">
					<div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
						<MousePointer2 size={20} className="text-white" />
					</div>
					<div>
						<h3 className="text-xl font-semibold text-white">Cursor</h3>
						<p className="text-slate-400">Cursor appearance and behavior</p>
					</div>
				</div>

				<div className="space-y-6">
					<RadioGroup
						value={settings.cursor.style}
						onChange={(value) => {
							updateSettings({
								cursor: {
									...settings.cursor,
									style: value,
								},
							});
						}}
						options={[
							{ value: "line", label: "Line" },
							{ value: "block", label: "Block" },
							{ value: "underline", label: "Underline" },
						]}
						label="Cursor Style"
						description="Choose how the cursor appears"
					/>
					<RadioGroup
						value={settings.cursor.blinking}
						onChange={(value) => {
							updateSettings({
								cursor: {
									...settings.cursor,
									blinking: value,
								},
							});
						}}
						options={[
							{ value: "blink", label: "Blink" },
							{ value: "smooth", label: "Smooth" },
							{ value: "phase", label: "Phase" },
							{ value: "expand", label: "Expand" },
							{ value: "solid", label: "Solid" },
						]}
						label="Cursor Animation"
						description="Choose how the cursor animates"
					/>
					<Checkbox
						checked={settings.cursor.smoothCaret}
						onChange={() => {
							updateSettings({
								cursor: {
									...settings.cursor,
									smoothCaret: !settings.cursor.smoothCaret,
								},
							});
						}}
						label="Smooth Caret Movement"
						description="Enable smooth cursor animations when moving"
					/>
				</div>
			</motion.div>

			{/* IntelliSense Settings */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.5 }}
				className="bg-slate-800/40 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/30"
			>
				<div className="flex items-center gap-3 mb-6">
					<div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center">
						<Sparkles size={20} className="text-white" />
					</div>
					<div>
						<h3 className="text-xl font-semibold text-white">IntelliSense</h3>
						<p className="text-slate-400">Code completion and suggestions</p>
					</div>
				</div>

				<div className="space-y-6">
					<Checkbox
						checked={settings.intellisense.enabled}
						onChange={() => {
							updateSettings({
								intellisense: {
									...settings.intellisense,
									enabled: !settings.intellisense.enabled,
								},
							});
						}}
						label="Enable IntelliSense"
						description="Show code suggestions while typing"
					/>
					<Checkbox
						checked={settings.intellisense.compactMode}
						onChange={() => {
							updateSettings({
								intellisense: {
									...settings.intellisense,
									compactMode: !settings.intellisense.compactMode,
								},
							});
						}}
						label="Compact Mode"
						description="Hide suggestion details and documentation"
					/>
					<RadioGroup
						value={settings.intellisense.acceptSuggestionKey}
						onChange={(value) => {
							updateSettings({
								intellisense: {
									...settings.intellisense,
									acceptSuggestionKey: value as "Tab" | "Enter",
								},
							});
						}}
						options={[
							{ value: "Tab", label: "Tab" },
							{ value: "Enter", label: "Enter" },
						]}
						label="Accept Suggestion Key"
						description="Choose which key accepts the selected suggestion"
					/>
					<Slider
						value={settings.intellisense.maxSuggestions}
						onChange={(value) =>
							handleSliderChange("intellisense", "maxSuggestions", value)
						}
						min={5}
						max={10}
						label="Maximum suggestions"
						description="Number of suggestions to show at once"
					/>
				</div>
			</motion.div>
		</div>
	);
};
