import { useState, useEffect, useCallback, useRef } from 'react';
import type {
  TerminalLine,
} from '@/utils/terminalCommands';
import {
  executeCommand,
  INITIAL_LINES
} from '@/utils/terminalCommands';

interface UseTerminalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const useTerminal = ({ isOpen, onClose }: UseTerminalProps) => {
  const [terminalLines, setTerminalLines] = useState<TerminalLine[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [isMaximized, setIsMaximized] = useState(false);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when terminal lines change
  useEffect(() => {
    if (outputRef.current && terminalLines.length > 0) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [terminalLines]);

  // Initialize terminal when opened
  useEffect(() => {
    if (isOpen) {
      setTerminalLines(INITIAL_LINES);
      setIsMaximized(false);
      setCurrentInput('');
      setHistoryIndex(-1);
      // Focus input when terminal opens
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Add command to terminal and execute
  const handleCommand = useCallback((input: string) => {
    if (!input.trim()) return;

    // Add command to history
    setCommandHistory(prev => {
      const newHistory = [...prev, input];
      return newHistory.slice(-50); // Keep last 50 commands
    });
    setHistoryIndex(-1);

    // Add command line to output
    const commandLine: TerminalLine = {
      content: `$ ${input}`,
      type: 'command',
      timestamp: new Date(),
    };

    // Execute command and get result
    const result = executeCommand(input);

    // Handle special command results
    if (result.shouldClose) {
      setTimeout(onClose, 500);
      return;
    }

    if (result.shouldClear) {
      setTerminalLines([]);
      return;
    }

    // Add command and output to terminal
    setTerminalLines(prev => [...prev, commandLine, ...result.lines]);
  }, [onClose]);

  // Handle keyboard input
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case 'Enter':
        e.preventDefault();
        handleCommand(currentInput);
        setCurrentInput('');
        break;

      case 'ArrowUp': {
        e.preventDefault();
        if (commandHistory.length > 0) {
          const newIndex = Math.min(historyIndex + 1, commandHistory.length - 1);
          setHistoryIndex(newIndex);
          setCurrentInput(commandHistory[commandHistory.length - 1 - newIndex] || '');
        }
        break;
      }

      case 'ArrowDown': {
        e.preventDefault();
        if (historyIndex > 0) {
          const newIndex = historyIndex - 1;
          setHistoryIndex(newIndex);
          setCurrentInput(commandHistory[commandHistory.length - 1 - newIndex] || '');
        } else if (historyIndex === 0) {
          setHistoryIndex(-1);
          setCurrentInput('');
        }
        break;
      }

      case 'Tab': {
        e.preventDefault();
        // Simple tab completion for common commands
        const commands = ['help', 'clear', 'about', 'skills', 'contact', 'projects', 'exit'];
        const matches = commands.filter(cmd => cmd.startsWith(currentInput.toLowerCase()));
        if (matches.length === 1) {
          setCurrentInput(matches[0]);
        }
        break;
      }

      case 'Escape':
        e.preventDefault();
        onClose();
        break;

      case 'l':
        if (e.ctrlKey || e.metaKey) {
          e.preventDefault();
          setTerminalLines([]);
        }
        break;
    }
  }, [currentInput, commandHistory, historyIndex, handleCommand, onClose]);

  // Toggle maximize
  const toggleMaximize = useCallback(() => {
    setIsMaximized(prev => !prev);
  }, []);

  // Clear terminal
  const clearTerminal = useCallback(() => {
    setTerminalLines([]);
  }, []);

  return {
    terminalLines,
    currentInput,
    setCurrentInput,
    isMaximized,
    handleKeyDown,
    toggleMaximize,
    clearTerminal,
    inputRef,
    outputRef,
  };
};