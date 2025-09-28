/**
 * Terminal Commands and Execution Logic
 * @fileoverview Enhanced terminal command system with proper typing and error handling
 */

// ============================================================================
// LOCAL TYPES (to avoid circular dependencies)
// ============================================================================

export interface TerminalLine {
  readonly id: string;
  readonly content: string;
  readonly type: 'command' | 'output' | 'error' | 'success' | 'info' | 'warning' | 'system';
  readonly timestamp: Date;
  readonly metadata?: Record<string, unknown>;
}

export interface CommandResult {
  readonly lines: readonly TerminalLine[];
  readonly shouldClear: boolean;
  readonly shouldClose: boolean;
  readonly exitCode: number;
}

export interface TerminalCommand {
  readonly name: string;
  readonly description: string;
  readonly usage: string;
  readonly aliases: readonly string[];
  readonly execute: (args: readonly string[]) => CommandResult;
}

const createLine = (
  content: string,
  type: TerminalLine['type'] = 'output'
): TerminalLine => ({
  id: `line_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
  content,
  type,
  timestamp: new Date(),
});

// ============================================================================
// INITIAL TERMINAL STATE
// ============================================================================

export const INITIAL_LINES: readonly TerminalLine[] = [
  createLine("[CYBERNETIC NODE] ⇢ Portfolio Shell v3.7", 'system'),
  createLine("[NEURAL LINK] Establishing encrypted channel...", 'system'),
  createLine("[AUTH] Biometrics spoofed • Access level: VISITOR", 'success'),
  createLine("[CORE] Spinning up modules → UI_RENDERER • STATE_MANAGER • SIGNAL_GRID", 'system'),
  createLine("[MEMORY] Syncing case files and mission logs", 'system'),
  createLine("[STATUS] Systems nominal • Latency 0.42ms • Power 99%", 'success'),
  createLine("", 'output'),
  createLine("Tap 'help' to list directives or 'ls' to surface directories.", 'info'),
  createLine("", 'output'),
];

// ============================================================================
// COMMAND DEFINITIONS
// ============================================================================

export const terminalCommands: Record<string, TerminalCommand> = {};

// ============================================================================
// COMMAND EXECUTION ENGINE
// ============================================================================

export const executeCommand = (input: string): CommandResult => {
  const trimmedInput = input.trim();

  if (!trimmedInput) {
    return {
      lines: [createLine("")],
      shouldClose: false,
      shouldClear: false,
      exitCode: 0,
    };
  }

  // Parse command and arguments
  const [commandName, ...args] = trimmedInput.toLowerCase().split(/\s+/);

  // Direct command lookup
  let command = terminalCommands[commandName];

  // If not found, try aliases
  if (!command) {
    command = Object.values(terminalCommands).find(cmd =>
      cmd.aliases.includes(commandName)
    );
  }

  if (command) {
    try {
      return command.execute(args);
    } catch (error) {
      return {
        lines: [
          createLine(`Error executing command: ${(error as Error).message}`, 'error'),
          createLine(""),
        ],
        shouldClose: false,
        shouldClear: false,
        exitCode: 1,
      };
    }
  }

  // Command not found
  const suggestions = Object.keys(terminalCommands)
    .filter(cmd => cmd.startsWith(commandName.substring(0, 2)))
    .slice(0, 3);

  const suggestionText = suggestions.length > 0
    ? `Did you mean: ${suggestions.join(', ')}?`
    : "Type 'help' to see available commands";

  return {
    lines: [
      createLine(`Command not found: ${commandName}`, 'error'),
      createLine(suggestionText, 'info'),
      createLine(""),
    ],
    shouldClose: false,
    shouldClear: false,
    exitCode: 127, // Standard exit code for "command not found"
  };
};

// ============================================================================
// STYLING UTILITIES
// ============================================================================

export const getLineClassName = (line: TerminalLine): string => {
  const baseClasses = "font-mono text-sm leading-relaxed animate-in fade-in duration-300";

  switch (line.type) {
    case 'command':
      return `${baseClasses} text-[#00D9FF] font-medium`;
    case 'system':
      return `${baseClasses} text-[#00D9FF] font-bold`;
    case 'separator':
      return `${baseClasses} text-[#00D9FF]/60`;
    case 'error':
      return `${baseClasses} text-red-400 font-medium`;
    case 'warning':
      return `${baseClasses} text-orange-400`;
    case 'success':
      return `${baseClasses} text-green-400`;
    case 'info':
      return `${baseClasses} text-[#00D9FF]/80`;
    case 'output':
    default:
      return `${baseClasses} text-[#FFFFFF]`;
  }
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export const getAllCommands = (): readonly string[] => {
  return Object.keys(terminalCommands);
};

export const getCommandAliases = (): readonly string[] => {
  return Object.values(terminalCommands)
    .flatMap(cmd => cmd.aliases);
};

export const searchCommands = (query: string): readonly string[] => {
  const lowerQuery = query.toLowerCase();
  return Object.keys(terminalCommands)
    .filter(cmd =>
      cmd.includes(lowerQuery) ||
      terminalCommands[cmd]!.description.toLowerCase().includes(lowerQuery)
    );
};