import { formatTime } from "../../../utils/timestamp";
interface HeaderProps {
  currentTime: Date;
}

export function Header({ currentTime }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 p-6 backdrop-blur-sm bg-black/20 border-b border-cyan-500/20">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-6 text-xs font-mono text-cyan-400">
          <span>SYSTEM_ONLINE</span>
          <span className="text-gray-500">|</span>
          <span>PARIS_IDF_{formatTime(currentTime)}</span>
        </div>
        <div className="flex items-center space-x-4 text-xs font-mono text-gray-400">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span>ACTIVE</span>
          </div>
        </div>
      </div>
    </header>
  );
}
