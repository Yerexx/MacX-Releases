import { type FC } from "react";
import { motion } from "motion/react";
import { Code2, Zap, BookOpen, Settings, Sparkles, ArrowRight } from "lucide-react";

interface WelcomeScreenProps {
	onGetStarted: () => void;
}

export const WelcomeScreen: FC<WelcomeScreenProps> = ({ onGetStarted }) => {
	return (
		<div className="h-full w-full flex items-center justify-center bg-macx-hero relative overflow-hidden">
			{/* Animated background elements */}
			<div className="absolute inset-0">
				<div className="absolute top-20 left-20 w-32 h-32 bg-macx-primary/10 rounded-full blur-3xl animate-pulse" />
				<div className="absolute bottom-20 right-20 w-40 h-40 bg-macx-secondary/10 rounded-full blur-3xl animate-pulse delay-1000" />
				<div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-macx-accent/5 rounded-full blur-3xl animate-pulse delay-500" />
			</div>

			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.8, ease: "easeOut" }}
				className="relative z-10 text-center max-w-4xl mx-auto px-8"
			>
				{/* Hero Section */}
				<motion.div
					initial={{ scale: 0.8, opacity: 0 }}
					animate={{ scale: 1, opacity: 1 }}
					transition={{ duration: 0.6, delay: 0.2 }}
					className="mb-12"
				>
					<div className="flex items-center justify-center mb-6">
						<div className="p-4 rounded-3xl bg-macx-gradient shadow-macx-glow">
							<Code2 size={48} className="text-white" />
						</div>
					</div>
					
					<h1 className="text-6xl font-bold mb-4">
						<span className="text-macx-gradient bg-clip-text text-transparent">MacX</span>
					</h1>
					
					<p className="text-xl text-macx-subtext mb-2">
						The Ultimate Script Execution Platform
					</p>
					
					<p className="text-macx-muted max-w-2xl mx-auto leading-relaxed">
						Experience the next generation of script execution with MacX. 
						Built for developers, designed for performance, crafted for excellence.
					</p>
				</motion.div>

				{/* Features Grid */}
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, delay: 0.4 }}
					className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
				>
					{[
						{
							icon: Code2,
							title: "Advanced Editor",
							description: "Syntax highlighting, auto-completion, and intelligent code analysis",
							color: "text-macx-primary"
						},
						{
							icon: Zap,
							title: "Lightning Fast",
							description: "Optimized execution engine with instant script deployment",
							color: "text-macx-accent"
						},
						{
							icon: BookOpen,
							title: "Script Hub",
							description: "Curated collection of premium scripts and utilities",
							color: "text-macx-secondary"
						},
						{
							icon: Settings,
							title: "Customizable",
							description: "Tailor every aspect to match your workflow preferences",
							color: "text-macx-warning"
						}
					].map((feature, index) => (
						<motion.div
							key={feature.title}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
							className="macx-card-hover p-6 text-center group"
						>
							<div className={`inline-flex p-3 rounded-2xl bg-macx-surface mb-4 group-hover:scale-110 transition-transform duration-300`}>
								<feature.icon size={24} className={feature.color} />
							</div>
							<h3 className="text-lg font-semibold text-macx-text mb-2">{feature.title}</h3>
							<p className="text-sm text-macx-muted leading-relaxed">{feature.description}</p>
						</motion.div>
					))}
				</motion.div>

				{/* Call to Action */}
				<motion.div
					initial={{ opacity: 0, scale: 0.9 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{ duration: 0.5, delay: 1 }}
					className="flex flex-col sm:flex-row items-center justify-center gap-4"
				>
					<button
						onClick={onGetStarted}
						className="btn-primary flex items-center gap-3 text-lg px-8 py-4 group"
					>
						<Sparkles size={20} className="group-hover:rotate-12 transition-transform duration-300" />
						Get Started
						<ArrowRight size={20} className="group-hover:translate-x-1 transition-transform duration-300" />
					</button>
					
					<div className="text-sm text-macx-muted">
						Powered by <span className="text-macx-accent font-medium">Hydrogen</span> • 
						Built with <span className="text-macx-primary font-medium">Tauri</span>
					</div>
				</motion.div>
			</motion.div>
		</div>
	);
};