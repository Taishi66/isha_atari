import { HEADER_ONLINE, LOCATION, STATUS } from "@/constants/ui";
import { formatTime } from "@/utils/timestamp";
import ThemeManager from "@/components/ui/ThemeManager";

interface HeaderProps {
    currentTime: Date;
}

const Header = ({ currentTime }: HeaderProps) => {
    return (
        <header className="fixed top-0 left-0 right-0 z-40 px-4 py-3 sm:px-6 sm:py-4 lg:px-8 lg:py-6 backdrop-blur-sm bg-black/40 border-b" style={{ borderColor: 'var(--theme-border-primary)' }}>
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                <div className="flex items-center space-x-3 sm:space-x-6 text-xs sm:text-sm font-mono" style={{ color: 'var(--theme-primary)' }}>
                    <span className="hidden sm:inline">{HEADER_ONLINE}</span>
                    <span className="hidden sm:inline text-gray-500" style={{ color: 'var(--theme-primary)' }}>|</span>
                    <span className="text-xs sm:text-sm">
                        <span className="hidden sm:inline">{LOCATION}</span>
                        {formatTime(currentTime)}
                    </span>
                </div>
                <div className="flex items-center space-x-3 sm:space-x-4 text-xs font-mono text-gray-400">
                    <div className="flex items-center space-x-2">
                        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full animate-pulse" style={{ backgroundColor: 'var(--theme-success)' }}></div>
                        <span className="hidden sm:inline">{STATUS}</span>
                    </div>
                    <ThemeManager isHeaderMode={true} />
                </div>
            </div>
        </header>
    );
};

export default Header;
