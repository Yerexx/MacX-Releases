import {
	ChevronDown,
	ChevronUp,
	Maximize2,
	Minimize2,
	Play,
	Square,
	Terminal,
	Trash2,
} from "lucide-react";
import { motion } from "motion/react";
import { type FC, memo, useCallback, useEffect, useRef, useState } from "react";
import { Tooltip } from "react-tooltip";
import {
	CONSOLE_COLORS,
	CONSOLE_CONFIG,
} from "../constants/roblox/robloxConsole";
import { CONSOLE_STORAGE_KEY } from "../constants/ui/console";
import { useLocalStorage } from "../hooks/core/useLocalStorage";
import { useSettings } from "../hooks/core/useSettings";
import { useConsole } from "../hooks/ui/useConsole";
import type {
	LogLine,
	RobloxConsoleProps,
} from "../types/roblox/robloxConsole";
import type { ConsoleState } from "../types/ui/console";

const ConsoleHeader = memo(
	({
		isOpen,
		onToggle,
		isWatching,
		onClear,
		onToggleWatch,
		isFloating,
		onFloatToggle,
		onDragStart,
	}: {
		isOpen: boolean;
		onToggle: () => void;
		isWatching: boolean;
		onClear: () => void;
		onToggleWatch: () => void;
		isFloating: boolean;
		onFloatToggle: () => void;
		onDragStart?: (e: React.MouseEvent) => void;
	}) => (
		<div
			className="flex h-10 cursor-move select-none items-center justify-between border-b border-white/5 bg-ctp-mantle px-4"
			onMouseDown={onDragStart}
		>
			<div className="flex items-center gap-2">
				<button
					type="button"
					onClick={onToggle}
					data-tooltip-id="console-tooltip"
					data-tooltip-content={isOpen ? "Collapse console" : "Expand console"}
					className="cursor-pointer rounded p-1 hover:bg-white/5"
				>
					{isOpen ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
				</button>
				<span className="text-sm font-medium">Roblox Console</span>
			</div>
			<div className="flex items-center gap-2">
				<button
					type="button"
					onClick={onClear}
					data-tooltip-id="console-tooltip"
					data-tooltip-content="Clear console"
					className="cursor-pointer rounded p-1 text-ctp-subtext0 hover:bg-white/5 hover:text-ctp-text"
				>
					<Trash2 size={16} />
				</button>
				<button
					type="button"
					onClick={onToggleWatch}
					data-tooltip-id="console-tooltip"
					data-tooltip-content={isWatching ? "Stop watching" : "Start watching"}
					className={`cursor-pointer rounded p-1 hover:bg-white/5 ${
						isWatching ? "text-red-400" : "text-green-400"
					}`}
				>
					{isWatching ? <Square size={16} /> : <Play size={16} />}
				</button>
				<button
					type="button"
					onClick={onFloatToggle}
					data-tooltip-id="console-tooltip"
					data-tooltip-content={isFloating ? "Dock console" : "Float console"}
					className="cursor-pointer rounded p-1 text-ctp-subtext0 hover:bg-white/5 hover:text-ctp-text"
				>
					{isFloating ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
				</button>
			</div>
		</div>
	),
);

ConsoleHeader.displayName = "ConsoleHeader";

const ConsoleLog = memo<{ log: LogLine; isResizing: boolean }>(
	({ log, isResizing }) => (
		<div
			className={`px-4 py-1.5 hover:bg-white/5 ${
				CONSOLE_COLORS[log.level]
			} border-b border-white/5 last:border-0`}
		>
			<span className="mr-2 select-none text-ctp-subtext0">
				{new Date(log.timestamp).toLocaleTimeString()}
			</span>
			<span className="select-none font-medium">[{log.level}]</span>{" "}
			<span
				className={`${isResizing ? "select-none" : "select-text"} break-all`}
			>
				{log.message}
			</span>
		</div>
	),
);

ConsoleLog.displayName = "ConsoleLog";

const EmptyState = () => (
	<div className="flex h-full flex-col items-center justify-center p-4 text-center">
		<Terminal size={32} className="mb-3 text-ctp-subtext0" strokeWidth={1.5} />
		<div className="font-medium text-ctp-subtext0">No logs available</div>
		<div className="mt-1 text-sm text-ctp-subtext0/75">
			Click the <Play size={14} className="mx-1 inline-block text-green-400" />{" "}
			button to start watching
		</div>
	</div>
);

export const RobloxConsole: FC<RobloxConsoleProps> = ({ isOpen, onToggle }) => {
	const { settings } = useSettings();
	const {
		logs,
		isWatching,
		startWatching,
		stopWatching,
		clearLogs,
		isFloating,
		setIsFloating,
	} = useConsole();

	const [consoleState, setConsoleState] = useLocalStorage<ConsoleState>(
		CONSOLE_STORAGE_KEY,
		{
			position: {
				x: window.innerWidth / 2 - 400,
				y: window.innerHeight / 2 - 200,
			},
			size: {
				width: 800,
				height: 300,
			},
			isFloating: false,
		},
	);

	const {
		position = {
			x: window.innerWidth / 2 - 400,
			y: window.innerHeight / 2 - 200,
		},
		size = { width: 800, height: 300 },
	} = consoleState;

	const [isDragging, setIsDragging] = useState(false);
	const [isResizing, setIsResizing] = useState(false);
	const [resizeType, setResizeType] = useState<
		"right" | "bottom" | "corner" | null
	>(null);
	const dragStartPos = useRef<{ x: number; y: number } | null>(null);
	const resizeStartPos = useRef<{
		x: number;
		y: number;
		width: number;
		height: number;
	} | null>(null);
	const consoleRef = useRef<HTMLDivElement>(null);
	const logsEndRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (logsEndRef.current) {
			logsEndRef.current.scrollIntoView({ behavior: "smooth" });
		}
	}, []);

	const handleDrag = useCallback(
		(e: MouseEvent) => {
			if (!isDragging || !dragStartPos.current) return;

			const newX = Math.max(
				0,
				Math.min(
					window.innerWidth - size.width,
					e.clientX - dragStartPos.current.x,
				),
			);
			const newY = Math.max(
				0,
				Math.min(
					window.innerHeight - size.height,
					e.clientY - dragStartPos.current.y,
				),
			);

			setConsoleState((prev) => ({
				...prev,
				position: { x: newX, y: newY },
			}));
		},
		[isDragging, size.width, size.height, setConsoleState],
	);

	const handleDragEnd = useCallback(() => {
		setIsDragging(false);
		dragStartPos.current = null;
	}, []);

	const handleResize = useCallback(
		(e: MouseEvent) => {
			if (!isResizing || !resizeStartPos.current || !resizeType) return;

			const deltaX = e.clientX - resizeStartPos.current.x;
			const deltaY = e.clientY - resizeStartPos.current.y;
			const maxWidth = window.innerWidth - position.x;
			const maxHeight = window.innerHeight - position.y;

			const newSize = { ...size };

			if (resizeType === "right" || resizeType === "corner") {
				newSize.width = Math.max(
					400,
					Math.min(maxWidth, resizeStartPos.current.width + deltaX),
				);
			}
			if (resizeType === "bottom" || resizeType === "corner") {
				newSize.height = Math.max(
					200,
					Math.min(maxHeight, resizeStartPos.current.height + deltaY),
				);
			}

			setConsoleState((prev) => ({
				...prev,
				size: newSize,
			}));
		},
		[isResizing, resizeType, position.x, position.y, size, setConsoleState],
	);

	const handleResizeEnd = useCallback(() => {
		setIsResizing(false);
		setResizeType(null);
		resizeStartPos.current = null;
	}, []);

	useEffect(() => {
		if (isDragging) {
			window.addEventListener("mousemove", handleDrag);
			window.addEventListener("mouseup", handleDragEnd);
		}
		if (isResizing) {
			window.addEventListener("mousemove", handleResize);
			window.addEventListener("mouseup", handleResizeEnd);
		}
		return () => {
			window.removeEventListener("mousemove", handleDrag);
			window.removeEventListener("mouseup", handleDragEnd);
			window.removeEventListener("mousemove", handleResize);
			window.removeEventListener("mouseup", handleResizeEnd);
		};
	}, [
		isDragging,
		isResizing,
		handleDrag,
		handleDragEnd,
		handleResize,
		handleResizeEnd,
	]);

	if (!settings.interface.showConsole) {
		return null;
	}

	if (settings.interface.zenMode && !isFloating) {
		return null;
	}

	const handleToggleWatch = async () => {
		try {
			if (isWatching) {
				await stopWatching();
			} else {
				await startWatching();
			}
		} catch (error) {
			console.error(error);
		}
	};

	const handleDragStart = (e: React.MouseEvent) => {
		if (!isFloating) return;
		setIsDragging(true);
		dragStartPos.current = {
			x: e.clientX - position.x,
			y: e.clientY - position.y,
		};
	};

	const handleResizeStart = (
		e: React.MouseEvent,
		type: "right" | "bottom" | "corner",
	) => {
		if (!isFloating) return;
		e.stopPropagation();
		setIsResizing(true);
		setResizeType(type);
		resizeStartPos.current = {
			x: e.clientX,
			y: e.clientY,
			width: size.width,
			height: size.height,
		};
	};

	const consoleStyle = isFloating
		? {
				position: "fixed" as const,
				top: position.y,
				left: position.x,
				width: `${size.width}px`,
				height: `${size.height}px`,
				transform: "none",
				zIndex: 9999,
			}
		: {};

	return (
		<motion.div
			initial={false}
			animate={{
				height: isOpen
					? isFloating
						? size.height
						: CONSOLE_CONFIG.DEFAULT_HEIGHT
					: CONSOLE_CONFIG.COLLAPSED_HEIGHT,
			}}
			transition={{
				type: "spring",
				stiffness: 300,
				damping: 30,
				mass: 0.8,
			}}
			className={`relative overflow-hidden bg-ctp-mantle shadow-2xl ${
				isFloating ? "rounded-lg" : "w-full"
			} ${isResizing ? "select-none" : ""}`}
			style={{
				...consoleStyle,
				userSelect: isResizing ? "none" : "text",
				WebkitUserSelect: isResizing ? "none" : "text",
			}}
		>
			<ConsoleHeader
				isOpen={isOpen}
				onToggle={onToggle}
				isWatching={isWatching}
				onClear={clearLogs}
				onToggleWatch={handleToggleWatch}
				isFloating={isFloating}
				onFloatToggle={() => setIsFloating(!isFloating)}
				onDragStart={handleDragStart}
			/>
			{isOpen && (
				<motion.div
					ref={consoleRef}
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ duration: 0.2 }}
					className="h-[calc(100%-2.5rem)] overflow-y-auto overflow-x-hidden bg-ctp-mantle font-mono text-sm"
					style={{
						userSelect: isResizing ? "none" : "text",
						WebkitUserSelect: isResizing ? "none" : "text",
					}}
				>
					{logs.length === 0 ? (
						<EmptyState />
					) : (
						<>
							{logs.map((log: LogLine, index: number) => (
								<ConsoleLog
									key={`${log.timestamp}-${index}`}
									log={log}
									isResizing={isResizing}
								/>
							))}
							<div ref={logsEndRef} />
						</>
					)}
				</motion.div>
			)}
			{isFloating && isOpen && (
				<>
					<div
						className="absolute right-0 top-[40px] h-[calc(100%-40px)] w-1 cursor-ew-resize select-none hover:bg-white/5"
						onMouseDown={(e) => handleResizeStart(e, "right")}
						data-tooltip-id="console-tooltip"
						data-tooltip-content="Resize width"
					/>
					<div
						className="absolute bottom-0 left-0 h-1 w-full cursor-ns-resize select-none hover:bg-white/5"
						onMouseDown={(e) => handleResizeStart(e, "bottom")}
						data-tooltip-id="console-tooltip"
						data-tooltip-content="Resize height"
					/>
					<div
						className="absolute bottom-0 right-0 h-4 w-4 cursor-nwse-resize select-none hover:bg-white/5"
						onMouseDown={(e) => handleResizeStart(e, "corner")}
						data-tooltip-id="console-tooltip"
						data-tooltip-content="Resize"
					/>
				</>
			)}
			<Tooltip
				id="console-tooltip"
				className="!z-50 !rounded-lg !border !border-white/5 !bg-ctp-mantle !px-2.5 !py-1.5 !text-xs !font-medium !shadow-lg"
				classNameArrow="!hidden"
				delayShow={50}
				delayHide={0}
			/>
		</motion.div>
	);
};
