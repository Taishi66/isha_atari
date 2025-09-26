import { HEADER_ONLINE, LOCATION, STATUS } from "@/constants/ui";
import { formatTime } from "@/utils/timestamp";
import { Terminal } from "lucide-react";

interface HeaderProps {
  currentTime: Date;
  onTerminalClick?: () => void;
}

const Header = ({ currentTime, onTerminalClick }: HeaderProps) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 p-6 backdrop-blur-sm bg-black/20 border-b" style={{ borderColor: 'var(--theme-border-primary)' }}>
      <div className="max-w mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-6 text-xs font-mono" style={{ color: 'var(--theme-primary)' }}>
          <span>{HEADER_ONLINE}</span>
          <span className="text-gray-500">|</span>
          <span>
            {LOCATION}
            {formatTime(currentTime)}
          </span>
        </div>
        <div className="flex items-center space-x-4 text-xs font-mono text-gray-400">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: 'var(--theme-success)' }}></div>
            <span>{STATUS}</span>
          </div>
          {onTerminalClick && (
            <button
              onClick={onTerminalClick}
              className="p-2 rounded border transition-all duration-200 group" style={{ color: 'var(--theme-primary)', borderColor: 'var(--theme-border-primary)', backgroundColor: 'transparent' }} onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--theme-accent)'; e.currentTarget.style.borderColor = 'var(--theme-border-secondary)'; e.currentTarget.style.backgroundColor = 'var(--theme-bg-active)'; }} onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--theme-primary)'; e.currentTarget.style.borderColor = 'var(--theme-border-primary)'; e.currentTarget.style.backgroundColor = 'transparent'; }}
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
