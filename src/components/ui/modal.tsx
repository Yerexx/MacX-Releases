import { motion } from "motion/react";
import { useSettings } from "../../hooks/core/useSettings";
import type { ModalProps } from "../../types/ui/ui";

const getScaleValue = (modalScale: "small" | "default" | "large"): number => {
	switch (modalScale) {
		case "small":
			return 0.8;
		case "large":
			return 1.2;
		default:
			return 1;
	}
};

export const Modal = ({
	isOpen,
	onClose,
	title,
	description,
	children,
	footer,
	onConfirm,
	confirmText = "Confirm",
	confirmVariant = "primary",
}: ModalProps) => {
	const { settings } = useSettings();
	const scale = getScaleValue(settings.interface.modalScale);

	if (!isOpen) return null;

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ duration: 0.2 }}
			className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
			onClick={(e) => {
				if (e.target === e.currentTarget) {
					onClose();
				}
			}}
		>
			<motion.div
				initial={{ scale: 0.95 * scale, y: 20 }}
				animate={{ scale: scale, y: 0 }}
				transition={{ duration: 0.2 }}
				className="mx-4 w-full max-w-md overflow-hidden rounded-xl border border-ctp-surface2 bg-ctp-surface0 shadow-lg"
			>
				<div
					className="flex items-center justify-between border-b border-ctp-surface2 p-4"
					style={{ fontSize: `${scale}em` }}
				>
					<div className="flex-1">
						<h3 className="text-sm font-medium text-ctp-text">{title}</h3>
						{description && (
							<p className="mt-1 text-sm text-ctp-subtext0">{description}</p>
						)}
					</div>
				</div>

				{children && (
					<div className="p-4" style={{ fontSize: `${scale}em` }}>
						{children}
					</div>
				)}

				{(footer || onConfirm) && (
					<div
						className="flex items-center justify-end gap-2 border-t border-ctp-surface2 p-4"
						style={{ fontSize: `${scale}em` }}
					>
						<button
							type="button"
							onClick={onClose}
							className="flex h-8 items-center justify-center rounded-lg border border-ctp-surface2 bg-ctp-surface1 px-3 text-xs font-medium text-accent transition-colors hover:bg-ctp-surface2"
						>
							Cancel
						</button>
						{onConfirm && (
							<button
								type="button"
								onClick={onConfirm}
								className={`flex h-8 items-center justify-center rounded-lg px-3 text-xs font-medium transition-colors ${
									confirmVariant === "destructive"
										? "border border-red-500/30 bg-red-500/10 text-ctp-red hover:bg-red-500/20"
										: "border border-accent/30 bg-accent/10 text-accent hover:bg-accent/20"
								}`}
							>
								{confirmText}
							</button>
						)}
						{footer}
					</div>
				)}
			</motion.div>
		</motion.div>
	);
};
