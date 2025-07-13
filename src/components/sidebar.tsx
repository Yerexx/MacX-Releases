import type { FC } from "react";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import { AnimatePresence, motion } from "motion/react";
import { ChevronLeft, ChevronRight, Settings } from "lucide-react";
import { BUTTON_SPACING, MAIN_SCREENS } from "../constants/ui/sidebar";
import { useSidebar } from "../hooks/ui/useSidebar";
import type { SidebarProps } from "../types/ui/sidebar";

interface ExtendedSidebarProps extends SidebarProps {
	collapsed?: boolean;
	onToggleCollapse?: () => void;
}

export const Sidebar: FC<ExtendedSidebarProps> = ({ 
	activeScreen, 
	onScreenChange, 
	collapsed = false, 
	onToggleCollapse 
}) => {
	const { isVisible } = useSidebar();

	return (
		<AnimatePresence>
			{isVisible && (
				<motion.div
					initial={{ x: -100, opacity: 0 }}
					animate={{ 
						x: 0, 
						opacity: 1,
						width: collapsed ? 60 : 280
					}}
					exit={{ x: -100, opacity: 0 }}
					transition={{ type: "spring", stiffness: 300, damping: 30 }}
					className="flex h-full flex-col bg-slate-900/60 backdrop-blur-xl border-r border-slate-700/30 shadow-2xl relative z-10 overflow-hidden"
				>
					{/* Header with Toggle */}
					<div className="flex items-center justify-between p-4 border-b border-slate-700/30">
						{!collapsed && (
							<motion.div 
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								className="flex items-center gap-3"
							>
								<div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 flex items-center justify-center">
									<img
										src="/MacX-logo.svg"
										alt="MacX"
										className="w-5 h-5"
									/>
								</div>
								<span className="font-semibold text-white">MacX</span>
							</motion.div>
						)}
						<button
							onClick={onToggleCollapse}
							className="p-2 rounded-lg hover:bg-slate-700/50 transition-colors text-slate-400 hover:text-white"
						>
							{collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
						</button>
					</div>

					{/* Navigation Section */}
					<div className="flex-1 p-4 space-y-2">
						{MAIN_SCREENS.map(({ id, icon: Icon, label }) => (
							<motion.button
								key={id}
								type="button"
								data-tooltip-id="sidebar-tooltip"
								data-tooltip-content={collapsed ? label : undefined}
								data-tooltip-place="right"
								data-tooltip-offset={8}
								onClick={() => {
									console.log(`Switching to screen: ${id}`);
									onScreenChange(id);
								}}
								whileHover={{ scale: 1.02 }}
								whileTap={{ scale: 0.98 }}
								className={`group relative flex items-center gap-3 w-full p-3 rounded-xl transition-all duration-300 ${
									activeScreen === id
										? "bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-white border border-cyan-500/30 shadow-lg shadow-cyan-500/10"
										: "text-slate-400 hover:text-white hover:bg-slate-700/30"
								}`}
							>
								<div className={`p-2 rounded-lg transition-colors ${
									activeScreen === id
										? "bg-gradient-to-br from-cyan-400 to-purple-500 text-white"
										: "bg-slate-700/50 group-hover:bg-slate-600/50"
								}`}>
									<Icon size={18} />
								</div>
								{!collapsed && (
									<motion.span 
										initial={{ opacity: 0, x: -10 }}
										animate={{ opacity: 1, x: 0 }}
										className="font-medium"
									>
										{label}
									</motion.span>
								)}
								{activeScreen === id && (
									<motion.div
										layoutId="activeIndicator"
										className="absolute right-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-cyan-400 to-purple-500 rounded-l-full"
									/>
								)}
							</motion.button>
						))}
					</div>

					{/* Bottom Section */}
					<div className="p-4 border-t border-slate-700/30">
						<motion.button
							type="button"
							data-tooltip-id="sidebar-tooltip"
							data-tooltip-content={collapsed ? "Settings" : undefined}
							data-tooltip-place="right"
							onClick={() => onScreenChange("Settings")}
							whileHover={{ scale: 1.02 }}
							whileTap={{ scale: 0.98 }}
							className="flex items-center gap-3 w-full p-3 rounded-xl text-slate-400 hover:text-white hover:bg-slate-700/30 transition-all duration-300"
						>
							<div className="p-2 rounded-lg bg-slate-700/50 hover:bg-slate-600/50 transition-colors">
								<Settings size={18} />
							</div>
							{!collapsed && (
								<motion.span 
									initial={{ opacity: 0, x: -10 }}
									animate={{ opacity: 1, x: 0 }}
									className="font-medium"
								>
									Settings
								</motion.span>
							)}
						</motion.button>
					</div>

					<Tooltip
						id="sidebar-tooltip"
						className="!z-50 !rounded-xl !border !border-slate-600 !bg-slate-800 !px-3 !py-2 !text-xs !font-semibold !shadow-xl !text-white"
						classNameArrow="!hidden"
						delayShow={100}
						delayHide={0}
					/>
				</motion.div>
			)}
		</AnimatePresence>
	);
};
