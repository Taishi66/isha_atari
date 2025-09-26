import { useState, useCallback, useRef, useEffect } from "react";
import { Palette, ChevronUp, ChevronDown } from "lucide-react";

interface Theme {
  id: string;
  name: string;
  primaryColor: string;
  status: 'active' | 'ready' | 'locked';
}

// Placeholder themes - will be replaced with actual theme system later
const THEMES: Theme[] = [
  { id: 'cybernetic', name: 'CYBERNETIC', primaryColor: '#00D9FF', status: 'active' },
  { id: 'matrix', name: 'MATRIX_GREEN', primaryColor: '#00FF41', status: 'ready' },
  { id: 'neon', name: 'NEON_PURPLE', primaryColor: '#FF00FF', status: 'ready' },
  { id: 'amber', name: 'AMBER_TERM', primaryColor: '#FFB000', status: 'locked' },
];

const ThemeManager = () => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [activeTheme, setActiveTheme] = useState<string>('cybernetic');
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [mouseDownPos, setMouseDownPos] = useState({ x: 0, y: 0 });
  const [hasMoved, setHasMoved] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);

  const handleToggleExpand = useCallback(() => {
    if (!hasMoved) {
      setIsExpanded(prev => !prev);
    }
  }, [hasMoved]);

  const handleThemeSelect = useCallback((themeId: string, status: string) => {
    if (status === 'locked') return;
    setActiveTheme(themeId);
    // Theme switching logic will be implemented later
    console.log(`Theme switched to: ${themeId}`);
  }, []);

  // Drag handlers - instant drag on mousedown
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    // Prevent dragging when clicking on theme selection items
    const target = e.target as HTMLElement;
    if (target.closest('[data-theme-item]')) {
      return;
    }

    setIsDragging(true);
    setHasMoved(false);
    setMouseDownPos({ x: e.clientX, y: e.clientY });
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
    e.preventDefault();
  }, [position]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;

    // Detect if mouse has moved enough to consider it a drag
    const deltaX = Math.abs(e.clientX - mouseDownPos.x);
    const deltaY = Math.abs(e.clientY - mouseDownPos.y);

    if (!hasMoved && (deltaX > 3 || deltaY > 3)) {
      setHasMoved(true);
    }

    const newX = e.clientX - dragStart.x;
    const newY = e.clientY - dragStart.y;

    // Constrain to viewport bounds
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      const maxX = window.innerWidth - rect.width - 20;
      const maxY = window.innerHeight - rect.height - 20;

      setPosition({
        x: Math.max(20, Math.min(maxX, newX)),
        y: Math.max(20, Math.min(maxY, newY))
      });
    }
  }, [isDragging, dragStart, mouseDownPos, hasMoved]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);

    // Reset movement flag after a short delay to allow click to register
    setTimeout(() => {
      setHasMoved(false);
    }, 50);
  }, []);

  // Global event listeners for dragging
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.userSelect = 'none';

      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.body.style.userSelect = '';
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // Initialize position (bottom-right by default)
  useEffect(() => {
    setPosition({
      x: window.innerWidth - 280,
      y: window.innerHeight - 120
    });
  }, []);

  return (
    <div
      ref={containerRef}
      onMouseDown={handleMouseDown}
      className={`fixed z-[9998] select-none transition-all duration-200 ${
        isDragging ? 'cursor-grabbing' : 'cursor-grab'
      }`}
      style={{
        left: position.x,
        top: position.y,
      }}
    >
      {/* Main Theme Manager Container */}
      <div className="relative">
        {/* Expanded Theme Panel */}
        <div className={`absolute bottom-16 right-0 transition-all duration-300 ease-out ${
          isExpanded
            ? 'opacity-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 translate-y-4 pointer-events-none'
        }`}>
          <div className="bg-black/80 backdrop-blur-sm border border-cyan-500/20 min-w-[200px]">
            {/* Header */}
            <div className="border-b border-cyan-500/20 p-3">
              <div className="flex items-center justify-between">
                <div className="text-xs font-mono text-cyan-400/70 tracking-[0.2em]">
                  THEME_MATRIX
                </div>
                <div className="w-1 h-1 bg-cyan-400 rounded-full animate-pulse" />
              </div>
            </div>

            {/* Theme List */}
            <div className="p-2 space-y-1">
              {THEMES.map((theme, index) => (
                <div
                  key={theme.id}
                  data-theme-item
                  onClick={() => handleThemeSelect(theme.id, theme.status)}
                  className={`relative group p-2 transition-all duration-200 cursor-pointer ${
                    activeTheme === theme.id
                      ? 'bg-cyan-400/10 border border-cyan-400/40'
                      : theme.status === 'locked'
                      ? 'bg-black/20 border border-gray-700/40 cursor-not-allowed'
                      : 'bg-black/40 border border-cyan-500/20 hover:border-cyan-400/40 hover:bg-cyan-400/5'
                  }`}
                >
                  {/* Corner indicators for active theme */}
                  {activeTheme === theme.id && (
                    <>
                      <div className="absolute top-1 left-1 w-1 h-1 border-t border-l border-cyan-400" />
                      <div className="absolute top-1 right-1 w-1 h-1 border-t border-r border-cyan-400" />
                      <div className="absolute bottom-1 left-1 w-1 h-1 border-b border-l border-cyan-400" />
                      <div className="absolute bottom-1 right-1 w-1 h-1 border-b border-r border-cyan-400" />
                    </>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {/* Color indicator */}
                      <div
                        className="w-2 h-2 rounded-full border border-gray-600"
                        style={{ backgroundColor: theme.status === 'locked' ? '#666' : theme.primaryColor }}
                      />
                      <span className={`text-xs font-mono transition-colors duration-200 ${
                        activeTheme === theme.id
                          ? 'text-cyan-300'
                          : theme.status === 'locked'
                          ? 'text-gray-500'
                          : 'text-white/80 group-hover:text-cyan-300'
                      }`}>
                        {theme.name}
                      </span>
                    </div>

                    {/* Status indicator */}
                    <div className="flex items-center space-x-2">
                      <div className={`w-1 h-1 rounded-full ${
                        theme.status === 'active'
                          ? 'bg-green-400 animate-pulse'
                          : theme.status === 'ready'
                          ? 'bg-cyan-400'
                          : 'bg-gray-500'
                      }`} />
                      <span className={`text-xs font-mono ${
                        theme.status === 'active'
                          ? 'text-green-400'
                          : theme.status === 'ready'
                          ? 'text-cyan-400'
                          : 'text-gray-500'
                      }`}>
                        {theme.status.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  {/* Theme index */}
                  <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="text-xs font-mono text-cyan-400/40">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="border-t border-cyan-500/20 p-3">
              <div className="flex items-center justify-between text-xs font-mono text-cyan-400/60">
                <span>SYSTEM_THEMES</span>
                <span>{THEMES.filter(t => t.status !== 'locked').length}/{THEMES.length}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Toggle Button */}
        <button
          onClick={handleToggleExpand}
          className={`relative group bg-black/80 backdrop-blur-sm border transition-all duration-300 p-3 ${
            isExpanded
              ? 'border-cyan-400/60 bg-cyan-400/5'
              : 'border-cyan-500/20 hover:border-cyan-400/40 hover:bg-cyan-400/5'
          } ${isDragging ? 'scale-105 border-cyan-400/80 shadow-lg shadow-cyan-400/20' : ''}`}
        >
          {/* Corner indicators */}
          <div className={`absolute top-1 left-1 w-1 h-1 border-t border-l border-cyan-400/40 transition-opacity duration-300 ${
            isExpanded ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
          }`} />
          <div className={`absolute top-1 right-1 w-1 h-1 border-t border-r border-cyan-400/40 transition-opacity duration-300 ${
            isExpanded ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
          }`} />
          <div className={`absolute bottom-1 left-1 w-1 h-1 border-b border-l border-cyan-400/40 transition-opacity duration-300 ${
            isExpanded ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
          }`} />
          <div className={`absolute bottom-1 right-1 w-1 h-1 border-b border-r border-cyan-400/40 transition-opacity duration-300 ${
            isExpanded ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
          }`} />

          <div className="flex items-center space-x-3">
            <Palette size={16} className="text-cyan-400/80" />
            <div className="flex flex-col items-start">
              <span className="text-xs font-mono text-white/90">THEME</span>
              <span className="text-xs font-mono text-cyan-400/70">
                {THEMES.find(t => t.id === activeTheme)?.name || 'DEFAULT'}
              </span>
            </div>
            {isExpanded ? (
              <ChevronDown size={12} className="text-cyan-400/60" />
            ) : (
              <ChevronUp size={12} className="text-cyan-400/60" />
            )}
          </div>

          {/* Hover scan effect */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent" />
          </div>
        </button>

        {/* Status indicator */}
        <div className="absolute -top-2 -right-2 w-2 h-2 bg-green-400 rounded-full animate-pulse" />
      </div>
    </div>
  );
};

export default ThemeManager;