import { useState, useCallback, useRef, useEffect } from "react";
import { Palette, ChevronUp, ChevronDown } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

const ThemeManager = () => {
  const { currentTheme, themes, setTheme } = useTheme();
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
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
    setTheme(themeId);
  }, [setTheme]);

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
          <div className="bg-black/80 backdrop-blur-sm border min-w-[200px]" style={{ borderColor: 'var(--theme-border-primary)' }}>
            {/* Header */}
            <div className="border-b p-3" style={{ borderColor: 'var(--theme-border-primary)' }}>
              <div className="flex items-center justify-between">
                <div className="text-xs font-mono tracking-[0.2em]" style={{ color: 'var(--theme-text-muted)' }}>
                  THEME_MATRIX
                </div>
                <div className="w-1 h-1 rounded-full animate-pulse" style={{ backgroundColor: 'var(--theme-primary)' }} />
              </div>
            </div>

            {/* Theme List */}
            <div className="p-2 space-y-1">
              {themes.map((theme, index) => (
                <div
                  key={theme.id}
                  data-theme-item
                  onClick={() => handleThemeSelect(theme.id, theme.status)}
                  className={`relative group p-2 transition-all duration-200 cursor-pointer ${
                    currentTheme.id === theme.id
                      ? 'border border-[var(--theme-border-active)]'
                      : theme.status === 'locked'
                      ? 'bg-black/20 border border-gray-700/40 cursor-not-allowed'
                      : 'bg-black/40 border border-[var(--theme-border-primary)] hover:border-[var(--theme-border-secondary)]'
                  }`}
                  style={{
                    backgroundColor: currentTheme.id === theme.id ? theme.colors.background.active : undefined
                  }}
                >
                  {/* Corner indicators for active theme */}
                  {currentTheme.id === theme.id && (
                    <>
                      <div
                        className="absolute top-1 left-1 w-1 h-1 border-t border-l"
                        style={{ borderColor: theme.colors.primary }}
                      />
                      <div
                        className="absolute top-1 right-1 w-1 h-1 border-t border-r"
                        style={{ borderColor: theme.colors.primary }}
                      />
                      <div
                        className="absolute bottom-1 left-1 w-1 h-1 border-b border-l"
                        style={{ borderColor: theme.colors.primary }}
                      />
                      <div
                        className="absolute bottom-1 right-1 w-1 h-1 border-b border-r"
                        style={{ borderColor: theme.colors.primary }}
                      />
                    </>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {/* Color indicator */}
                      <div
                        className="w-2 h-2 rounded-full border border-gray-600"
                        style={{ backgroundColor: theme.status === 'locked' ? '#666' : theme.colors.primary }}
                      />
                      <span className={`text-xs font-mono transition-colors duration-200 ${
                        currentTheme.id === theme.id
                          ? 'text-[var(--theme-accent)]'
                          : theme.status === 'locked'
                          ? 'text-gray-500'
                          : 'text-white/80 group-hover:text-[var(--theme-accent)]'
                      }`}>
                        {theme.name}
                      </span>
                    </div>

                    {/* Status indicator */}
                    <div className="flex items-center space-x-2">
                      <div
                        className={`w-1 h-1 rounded-full ${
                          currentTheme.id === theme.id
                            ? 'animate-pulse'
                            : theme.status === 'ready'
                            ? ''
                            : ''
                        }`}
                        style={{
                          backgroundColor: currentTheme.id === theme.id
                            ? theme.colors.success
                            : theme.status === 'ready'
                            ? theme.colors.primary
                            : '#666'
                        }}
                      />
                      <span
                        className={`text-xs font-mono ${
                          currentTheme.id === theme.id
                            ? ''
                            : theme.status === 'ready'
                            ? ''
                            : 'text-gray-500'
                        }`}
                        style={{
                          color: currentTheme.id === theme.id
                            ? theme.colors.success
                            : theme.status === 'ready'
                            ? theme.colors.primary
                            : undefined
                        }}
                      >
                        {currentTheme.id === theme.id ? 'ACTIVE' : theme.status.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  {/* Theme index */}
                  <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="text-xs font-mono opacity-40" style={{ color: theme.colors.primary }}>
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="border-t p-3" style={{ borderColor: 'var(--theme-border-primary)' }}>
              <div className="flex items-center justify-between text-xs font-mono" style={{ color: 'var(--theme-text-muted)' }}>
                <span>SYSTEM_THEMES</span>
                <span>{themes.filter(t => t.status !== 'locked').length}/{themes.length}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Toggle Button */}
        <button
          onClick={handleToggleExpand}
          className={`relative group bg-black/80 backdrop-blur-sm border transition-all duration-300 p-3 ${
            isExpanded
              ? ''
              : ''
          } ${isDragging ? 'scale-105 shadow-lg' : ''}`}
          style={{
            borderColor: isExpanded ? 'var(--theme-border-secondary)' : 'var(--theme-border-primary)',
            backgroundColor: isExpanded ? 'var(--theme-bg-active)' : 'transparent',
            ...(isDragging && {
              borderColor: 'var(--theme-border-active)',
              boxShadow: `0 0 20px var(--theme-primary)`
            })
          }}
          onMouseEnter={(e) => {
            if (!isExpanded) {
              e.currentTarget.style.borderColor = 'var(--theme-border-secondary)';
              e.currentTarget.style.backgroundColor = 'var(--theme-bg-active)';
            }
          }}
          onMouseLeave={(e) => {
            if (!isExpanded) {
              e.currentTarget.style.borderColor = 'var(--theme-border-primary)';
              e.currentTarget.style.backgroundColor = 'transparent';
            }
          }}
        >
          {/* Corner indicators */}
          <div className={`absolute top-1 left-1 w-1 h-1 border-t border-l transition-opacity duration-300 ${
            isExpanded ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
          }`} style={{ borderColor: 'var(--theme-border-active)' }} />
          <div className={`absolute top-1 right-1 w-1 h-1 border-t border-r transition-opacity duration-300 ${
            isExpanded ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
          }`} style={{ borderColor: 'var(--theme-border-active)' }} />
          <div className={`absolute bottom-1 left-1 w-1 h-1 border-b border-l transition-opacity duration-300 ${
            isExpanded ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
          }`} style={{ borderColor: 'var(--theme-border-active)' }} />
          <div className={`absolute bottom-1 right-1 w-1 h-1 border-b border-r transition-opacity duration-300 ${
            isExpanded ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
          }`} style={{ borderColor: 'var(--theme-border-active)' }} />

          <div className="flex items-center space-x-3">
            <Palette size={16} style={{ color: 'var(--theme-primary)' }} />
            <div className="flex flex-col items-start">
              <span className="text-xs font-mono text-white/90">THEME</span>
              <span className="text-xs font-mono" style={{ color: currentTheme.colors.text.muted }}>
                {currentTheme.name}
              </span>
            </div>
            {isExpanded ? (
              <ChevronDown size={12} style={{ color: 'var(--theme-text-muted)' }} />
            ) : (
              <ChevronUp size={12} style={{ color: 'var(--theme-text-muted)' }} />
            )}
          </div>

          {/* Hover scan effect */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent to-transparent" style={{ backgroundImage: `linear-gradient(to right, transparent, var(--theme-primary), transparent)` }} />
          </div>
        </button>

        {/* Status indicator */}
        <div className="absolute -top-2 -right-2 w-2 h-2 bg-green-400 rounded-full animate-pulse" />
      </div>
    </div>
  );
};

export default ThemeManager;