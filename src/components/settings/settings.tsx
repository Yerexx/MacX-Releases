import { Search, Settings as SettingsIcon, X, ChevronDown, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { type FC, useState } from "react";
import { SETTINGS_SECTIONS } from "../../constants/core/settings";
import { ApplicationSection } from "./sections/applicationSection";
import { InterfaceSection } from "./sections/interfaceSection";
import { EditorSection } from "./sections/editorSection";
import { KeybindsSection } from "./sections/keybindsSection";

export const Settings: FC = () => {
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedSection, setSelectedSection] = useState<string | null>("editor");
	const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(["editor"]));

	const filteredSections = SETTINGS_SECTIONS.filter(
		(section) =>
			section.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
			section.description.toLowerCase().includes(searchTerm.toLowerCase()),
	);

	const toggleSection = (sectionId: string) => {
		const newExpanded = new Set(expandedSections);
		if (newExpanded.has(sectionId)) {
			newExpanded.delete(sectionId);
			if (selectedSection === sectionId) {
				setSelectedSection(null);
			}
		} else {
			newExpanded.add(sectionId);
			setSelectedSection(sectionId);
		}
		setExpandedSections(newExpanded);
	};

	const renderSectionContent = () => {
		switch (selectedSection) {
			case "editor":
				return <EditorSection />;
			case "interface":
				return <InterfaceSection />;
			case "keybinds":
				return <KeybindsSection />;
			case "application":
				return <ApplicationSection />;
			default:
				return null;
		}
	};

	return (
		<div className="h-full flex bg-gradient-to-br from-slate-950 via-indigo-950/50 to-purple-950/50">
			{/* Left Sidebar - Settings Navigation */}
			<div className="w-96 flex flex-col bg-slate-900/40 backdrop-blur-xl border-r border-slate-700/30">
				{/* Header */}
				<div className="p-6 border-b border-slate-700/30">
					<div className="flex items-center gap-3 mb-4">
						<div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 flex items-center justify-center">
							<SettingsIcon size={20} className="text-white" />
						</div>
						<div>
							<h1 className="text-xl font-bold text-white">Settings</h1>
							<p className="text-sm text-slate-400">Customize MacX</p>
						</div>
					</div>
					
					{/* Search Bar */}
					<div className="relative">
						<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
						<input
							type="text"
							placeholder="Search settings..."
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all duration-200"
						/>
						{searchTerm && (
							<button
								onClick={() => setSearchTerm("")}
								className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
							>
								<X size={16} />
							</button>
						)}
					</div>
				</div>

				{/* Settings Navigation */}
				<div className="flex-1 overflow-y-auto p-4 space-y-2">
					{filteredSections.map((section) => {
						const isExpanded = expandedSections.has(section.id);
						const isSelected = selectedSection === section.id;
						
						return (
							<div key={section.id} className="space-y-1">
								<motion.button
									type="button"
									onClick={() => toggleSection(section.id)}
									whileHover={{ scale: 1.01 }}
									whileTap={{ scale: 0.99 }}
									className={`group w-full rounded-xl p-4 text-left transition-all duration-300 flex items-center justify-between ${
										isSelected
											? "bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-white border border-cyan-500/30 shadow-lg shadow-cyan-500/10"
											: "hover:bg-slate-700/30 text-slate-300 border border-slate-700/30 hover:border-slate-600/50"
									}`}
								>
									<div className="flex items-center gap-3">
										<div className={`p-2 rounded-lg transition-colors duration-200 ${
											isSelected
												? "bg-gradient-to-br from-cyan-400 to-purple-500 text-white"
												: "bg-slate-700/50 group-hover:bg-slate-600/50 text-slate-400"
										}`}>
											<section.icon size={18} />
										</div>
										<div className="flex-1">
											<h3 className="font-semibold text-sm mb-1">{section.title}</h3>
											<p className={`text-xs ${
												isSelected ? "text-white/70" : "text-slate-500"
											}`}>
												{section.description}
											</p>
										</div>
									</div>
									<motion.div
										animate={{ rotate: isExpanded ? 90 : 0 }}
										transition={{ duration: 0.2 }}
										className={isSelected ? "text-white" : "text-slate-400"}
									>
										<ChevronRight size={16} />
									</motion.div>
								</motion.button>
							</div>
						);
					})}
				</div>
			</div>

			{/* Main Content Area */}
			<div className="flex-1 overflow-hidden">
				<AnimatePresence mode="wait">
					{selectedSection ? (
						<motion.div
							key={selectedSection}
							initial={{ opacity: 0, x: 20 }}
							animate={{ opacity: 1, x: 0 }}
							exit={{ opacity: 0, x: -20 }}
							transition={{ duration: 0.3 }}
							className="h-full overflow-y-auto"
						>
							{renderSectionContent()}
						</motion.div>
					) : (
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							className="flex items-center justify-center h-full"
						>
							<div className="text-center">
								<div className="w-24 h-24 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center">
									<SettingsIcon size={48} className="text-cyan-400" />
								</div>
								<h3 className="text-2xl font-semibold text-white mb-3">Welcome to Settings</h3>
								<p className="text-slate-400 text-lg">Select a category from the sidebar to customize MacX</p>
							</div>
						</motion.div>
					)}
				</AnimatePresence>
			</div>
		</div>
	);
};
