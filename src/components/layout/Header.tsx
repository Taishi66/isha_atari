import { HEADER_ONLINE, LOCATION, STATUS } from "@/constants/ui";
import { formatTime } from "@/utils/TimeStamp";
import { Terminal } from "lucide-react";

interface HeaderProps {
  currentTime: Date;
  onTerminalClick?: () => void;
}

const Header = ({ currentTime, onTerminalClick }: HeaderProps) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 p-6 backdrop-blur-sm bg-black/20 border-b border-cyan-500/20">
      <div className="max-w mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-6 text-xs font-mono text-cyan-400">
          <span>{HEADER_ONLINE}</span>
          <span className="text-gray-500">|</span>
          <span>
            {LOCATION}
            {formatTime(currentTime)}
          </span>
        </div>
        <div className="flex items-center space-x-4 text-xs font-mono text-gray-400">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span>{STATUS}</span>
          </div>
          {onTerminalClick && (
            <button
              onClick={onTerminalClick}
              className="p-2 text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10 rounded border border-cyan-500/30 hover:border-cyan-400/50 transition-all duration-200 group"
              title="Open Terminal"
            >
              <Terminal size={16} className="group-hover:animate-pulse" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
