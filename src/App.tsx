import { type FC, useEffect, useState } from "react";
import { FastFlags } from "./components/fastFlags/fastFlags";
import { Library } from "./components/library";
import { Settings } from "./components/settings/settings";
import { Sidebar } from "./components/sidebar";
import { StatusBar } from "./components/statusBar";
import { Topbar } from "./components/topbar";
import { CommandPalette } from "./components/ui/commandPalette";
import { Toaster } from "./components/ui/toast";
import { Workspace } from "./components/workspace/workspace";
import { EditorProvider } from "./contexts/editor/editorContext";
import { ExecuteProvider } from "./contexts/execute/executeContext";
import { FastFlagsProvider } from "./contexts/fastFlags/fastFlagsContext";
import { KeybindsProvider } from "./contexts/keybinds/keybindsContext";
import { SettingsProvider } from "./contexts/settings/settingsContext";
import { useSettings } from "./hooks/core/useSettings";
import "react-tooltip/dist/react-tooltip.css";
import { AutoExecute } from "./components/autoExecute/autoExecute";
import { HydrogenNotFound } from "./components/ui/hydrogenNotFound";
import { MessageModal } from "./components/ui/messageModal";
import { UpdateChecker } from "./components/updater";
import { APP_CONSTANTS } from "./constants/core/app";
import { ConsoleProvider } from "./contexts/console/consoleContext";
import { ExecutionHistoryProvider } from "./contexts/execution/executionHistoryContext";
import { SidebarProvider } from "./contexts/sidebar/sidebarContext";
import { WorkspaceProvider } from "./contexts/workspace/workspaceContext";
import { useKeybinds } from "./hooks/core/useKeybinds";
import { useConsole } from "./hooks/ui/useConsole";
import { checkHydrogenInstallation } from "./services/features/hydrogenService";
import { motion, AnimatePresence } from "motion/react";

const AppContent: FC = () => {
	const { settings } = useSettings();
	const {
		isCommandPaletteOpen,
		toggleCommandPalette,
		activeScreen,
		handleScreenChange,
	} = useKeybinds();
	const { isFloating, setIsFloating } = useConsole();
	const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
	const [rightPanelOpen, setRightPanelOpen] = useState(false);

	const toggleFloating = () => {
		setIsFloating(!isFloating);
	};

	const renderScreen = () => {
		switch (activeScreen) {
			case "Editor":
				return <Workspace />;
			case "Settings":
				return <Settings />;
			case "Library":
				return <Library />;
			case "AutoExecution":
				return <AutoExecute />;
			case "FastFlags":
				return <FastFlags />;
			default:
				return <Workspace />;
		}
	};

	// Enhanced loading state with MacX branding
	if (!settings) {
		return (
			<div className="flex h-screen items-center justify-center bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-950">
				<motion.div 
					initial={{ opacity: 0, scale: 0.8 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{ duration: 0.6, ease: "easeOut" }}
					className="flex flex-col items-center space-y-8"
				>
					<div className="relative">
						<motion.div 
							animate={{ rotate: 360 }}
							transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
							className="w-24 h-24 rounded-3xl bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 shadow-2xl shadow-blue-500/25"
						/>
						<motion.div 
							animate={{ scale: [1, 1.2, 1] }}
							transition={{ duration: 2, repeat: Infinity }}
							className="absolute inset-0 w-24 h-24 rounded-3xl bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 opacity-30 blur-xl"
						/>
					</div>
					<div className="text-center">
						<motion.h1 
							initial={{ y: 20, opacity: 0 }}
							animate={{ y: 0, opacity: 1 }}
							transition={{ delay: 0.3 }}
							className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent mb-3"
						>
							MacX
						</motion.h1>
						<motion.p 
							initial={{ y: 20, opacity: 0 }}
							animate={{ y: 0, opacity: 1 }}
							transition={{ delay: 0.5 }}
							className="text-slate-400 font-medium text-lg"
						>
							Initializing advanced workspace...
						</motion.p>
					</div>
				</motion.div>
			</div>
		);
	}

	return (
		<div className="h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-purple-950 text-white overflow-hidden">
			{/* Floating background elements */}
			<div className="absolute inset-0 overflow-hidden pointer-events-none">
				<motion.div 
					animate={{ 
						x: [0, 100, 0],
						y: [0, -50, 0],
						rotate: [0, 180, 360]
					}}
					transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
					className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"
				/>
				<motion.div 
					animate={{ 
						x: [0, -100, 0],
						y: [0, 50, 0],
						rotate: [360, 180, 0]
					}}
					transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
					className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
				/>
				<motion.div 
					animate={{ 
						scale: [1, 1.2, 1],
						opacity: [0.1, 0.2, 0.1]
					}}
					transition={{ duration: 8, repeat: Infinity }}
					className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-3xl"
				/>
			</div>

			{/* New Grid Layout */}
			<div className="h-full grid grid-rows-[auto_1fr_auto] grid-cols-[auto_1fr_auto] gap-0">
				{/* Top Bar - spans full width */}
				<motion.div 
					initial={{ y: -50, opacity: 0 }}
					animate={{ y: 0, opacity: 1 }}
					transition={{ duration: 0.5 }}
					className="col-span-3 z-30"
				>
					<Topbar />
				</motion.div>

				{/* Left Sidebar */}
				<motion.div 
					initial={{ x: -100, opacity: 0 }}
					animate={{ x: 0, opacity: 1 }}
					transition={{ duration: 0.5, delay: 0.1 }}
					className="row-span-1 z-20"
				>
					<Sidebar 
						activeScreen={activeScreen} 
						onScreenChange={handleScreenChange}
						collapsed={sidebarCollapsed}
						onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
					/>
				</motion.div>

				{/* Main Content Area */}
				<motion.main 
					initial={{ opacity: 0, scale: 0.95 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{ duration: 0.5, delay: 0.2 }}
					className="overflow-hidden relative z-10 m-4"
				>
					<div className="h-full rounded-2xl bg-slate-900/40 backdrop-blur-xl border border-slate-700/30 shadow-2xl overflow-hidden relative">
						{/* Subtle inner glow */}
						<div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-purple-500/5 pointer-events-none" />
						<div className="relative z-10 h-full">
							<AnimatePresence mode="wait">
								<motion.div
									key={activeScreen}
									initial={{ opacity: 0, x: 20 }}
									animate={{ opacity: 1, x: 0 }}
									exit={{ opacity: 0, x: -20 }}
									transition={{ duration: 0.3 }}
									className="h-full"
								>
									{renderScreen()}
								</motion.div>
							</AnimatePresence>
						</div>
					</div>
				</motion.main>

				{/* Right Panel (Optional) */}
				<AnimatePresence>
					{rightPanelOpen && (
						<motion.div 
							initial={{ x: 100, opacity: 0 }}
							animate={{ x: 0, opacity: 1 }}
							exit={{ x: 100, opacity: 0 }}
							transition={{ duration: 0.3 }}
							className="w-80 bg-slate-900/60 backdrop-blur-xl border-l border-slate-700/50 z-20"
						>
							<div className="p-6">
								<h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
								{/* Right panel content */}
							</div>
						</motion.div>
					)}
				</AnimatePresence>

				{/* Bottom Status Bar - spans available width */}
				<motion.div 
					initial={{ y: 50, opacity: 0 }}
					animate={{ y: 0, opacity: 1 }}
					transition={{ duration: 0.5, delay: 0.3 }}
					className={`z-30 ${rightPanelOpen ? 'col-span-2' : 'col-span-3'}`}
				>
					<StatusBar 
						onToggleRightPanel={() => setRightPanelOpen(!rightPanelOpen)}
						rightPanelOpen={rightPanelOpen}
					/>
				</motion.div>
			</div>

			{/* Floating Command Palette */}
			<AnimatePresence>
				{isCommandPaletteOpen && (
					<motion.div
						initial={{ opacity: 0, scale: 0.9, y: -20 }}
						animate={{ opacity: 1, scale: 1, y: 0 }}
						exit={{ opacity: 0, scale: 0.9, y: -20 }}
						transition={{ duration: 0.2 }}
						className="fixed inset-0 z-50 flex items-start justify-center pt-32"
					>
						<CommandPalette
							isOpen={isCommandPaletteOpen}
							onClose={toggleCommandPalette}
							onFloatToggle={toggleFloating}
						/>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
};

const App: FC = () => {
	const [isHydrogenInstalled, setIsHydrogenInstalled] = useState<
		boolean | null
	>(null);

	useEffect(() => {
		const checkHydrogen = async () => {
			try {
				const isInstalled = await checkHydrogenInstallation();
				setIsHydrogenInstalled(isInstalled);
			} catch (error) {
				console.error("Failed to check Hydrogen installation:", error);
				setIsHydrogenInstalled(false);
			}
		};

		checkHydrogen();
	}, []);

	if (isHydrogenInstalled === false) {
		return <HydrogenNotFound />;
	}

	return (
		<ExecuteProvider>
			<SettingsProvider>
				<WorkspaceProvider>
					<ExecutionHistoryProvider>
						<EditorProvider>
							<ConsoleProvider>
								<FastFlagsProvider>
									<SidebarProvider>
										<KeybindsProvider>
											<AppContent />
											<MessageModal
												currentVersion={APP_CONSTANTS.currentVersion}
											/>
											<UpdateChecker />
											<Toaster />
										</KeybindsProvider>
									</SidebarProvider>
								</FastFlagsProvider>
							</ConsoleProvider>
						</EditorProvider>
					</ExecutionHistoryProvider>
				</WorkspaceProvider>
			</SettingsProvider>
		</ExecuteProvider>
	);
};

export default App;
