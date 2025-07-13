import type { FC } from "react";
import { Sparkles, Terminal, Activity } from "lucide-react";
import { TrafficLights } from "./trafficLights";

export const Topbar: FC = () => {
	return (
		<div className="relative h-14 w-full border-b border-slate-700/50 bg-slate-800/80 backdrop-blur-xl">
			{/* Drag region */}
			<div className="absolute inset-0" data-tauri-drag-region />
			
			{/* Traffic lights */}
			<div className="absolute bottom-0 left-0 top-0 flex items-center">
				<TrafficLights />
			</div>
			
			{/* Center branding */}
			<div className="flex h-full items-center justify-center">
				<div className="flex items-center gap-4">
					{/* MacX Logo and Title */}
					<div className="flex items-center gap-3">
						<div className="relative">
							<div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 flex items-center justify-center shadow-lg">
								<Terminal size={16} className="text-white" />
							</div>
							<div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
								<Sparkles size={8} className="text-white" />
							</div>
						</div>
						<div className="flex flex-col">
							<h1 className="text-lg font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
								MacX
							</h1>
							<p className="text-xs text-slate-400 font-medium -mt-1">
								Modern Code Executor
							</p>
						</div>
					</div>
					
					{/* Separator */}
					<div className="h-8 w-px bg-slate-600/50" />
					
					{/* Status indicator */}
					<div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-700/50 border border-slate-600/30">
						<Activity size={12} className="text-green-400" />
						<span className="text-xs text-slate-300 font-medium">
							Powered by Hydrogen
						</span>
					</div>
				</div>
			</div>
			
			{/* Right side status */}
			<div className="absolute right-4 top-1/2 -translate-y-1/2">
				<div className="flex items-center gap-3">
					<div className="flex items-center gap-2">
						<div className="h-2 w-2 rounded-full bg-green-400 animate-pulse shadow-lg shadow-green-400/50" />
						<span className="text-xs text-slate-300 font-medium">Online</span>
					</div>
				</div>
			</div>
			
			{/* Bottom gradient line */}
			<div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
		</div>
	);
};
