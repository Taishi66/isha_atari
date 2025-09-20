export interface TerminalLine {
  content: string;
  type: 'command' | 'output' | 'error' | 'system' | 'separator';
  timestamp?: Date;
}

export interface CommandResult {
  lines: TerminalLine[];
  shouldClose?: boolean;
  shouldClear?: boolean;
}

export interface TerminalCommand {
  name: string;
  description: string;
  execute: () => CommandResult;
}

const createLine = (content: string, type: TerminalLine['type'] = 'output'): TerminalLine => ({
  content,
  type,
  timestamp: new Date(),
});

export const INITIAL_LINES: TerminalLine[] = [
  createLine("CYBERNETIC TERMINAL v2.4.1", 'system'),
  createLine("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━", 'separator'),
  createLine("System initialized successfully", 'system'),
  createLine("Type 'help' for available commands", 'system'),
  createLine("", 'output'),
];

export const terminalCommands: Record<string, TerminalCommand> = {
  help: {
    name: 'help',
    description: 'Show available commands',
    execute: (): CommandResult => ({
      lines: [
        createLine("Available commands:"),
        createLine("  help     - Show this help message"),
        createLine("  clear    - Clear terminal"),
        createLine("  about    - About this system"),
        createLine("  skills   - Display technical skills"),
        createLine("  contact  - Show contact information"),
        createLine("  projects - List recent projects"),
        createLine("  exit     - Close terminal"),
        createLine(""),
      ],
    }),
  },

  clear: {
    name: 'clear',
    description: 'Clear terminal screen',
    execute: (): CommandResult => ({
      lines: [],
      shouldClear: true,
    }),
  },

  about: {
    name: 'about',
    description: 'About this system',
    execute: (): CommandResult => ({
      lines: [
        createLine("CYBERNETIC PORTFOLIO SYSTEM", 'system'),
        createLine("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━", 'separator'),
        createLine("Built with React + TypeScript + Vite"),
        createLine("Styled with Tailwind CSS"),
        createLine("Designed for the future of web development"),
        createLine(""),
        createLine("Portfolio of JC LAMY - Full Stack Developer"),
        createLine("Based in Paris, France"),
        createLine(""),
      ],
    }),
  },

  skills: {
    name: 'skills',
    description: 'Display technical skills',
    execute: (): CommandResult => ({
      lines: [
        createLine("TECHNICAL SKILLS", 'system'),
        createLine("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━", 'separator'),
        createLine("Frontend: React, TypeScript, Vue.js, Next.js"),
        createLine("Backend: Node.js, Python, PHP, Java"),
        createLine("Database: PostgreSQL, MongoDB, Redis"),
        createLine("DevOps: Docker, AWS, CI/CD"),
        createLine("Tools: Git, VSCode, Figma"),
        createLine(""),
      ],
    }),
  },

  contact: {
    name: 'contact',
    description: 'Show contact information',
    execute: (): CommandResult => ({
      lines: [
        createLine("CONTACT INFORMATION", 'system'),
        createLine("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━", 'separator'),
        createLine("Email: lamypro66@gmail.com"),
        createLine("Location: Paris, France"),
        createLine("Remote work: Available"),
        createLine("Status: Open to opportunities"),
        createLine(""),
      ],
    }),
  },

  projects: {
    name: 'projects',
    description: 'List recent projects',
    execute: (): CommandResult => ({
      lines: [
        createLine("RECENT PROJECTS", 'system'),
        createLine("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━", 'separator'),
        createLine("1. Cybernetic Portfolio - Personal website with terminal interface"),
        createLine("2. E-commerce Platform - Full-stack solution with React & Node.js"),
        createLine("3. Data Analytics Dashboard - Real-time visualization tool"),
        createLine("4. Mobile App - Cross-platform development with React Native"),
        createLine(""),
      ],
    }),
  },

  exit: {
    name: 'exit',
    description: 'Close terminal',
    execute: (): CommandResult => ({
      lines: [createLine("Goodbye! Terminal session ended.", 'system')],
      shouldClose: true,
    }),
  },
};

export const executeCommand = (input: string): CommandResult => {
  const trimmedInput = input.toLowerCase().trim();

  if (!trimmedInput) {
    return { lines: [createLine("")] };
  }

  const command = terminalCommands[trimmedInput];

  if (command) {
    return command.execute();
  }

  return {
    lines: [
      createLine(`Command not found: ${input}`, 'error'),
      createLine("Type 'help' to see available commands"),
      createLine(""),
    ],
  };
};

export const getLineClassName = (line: TerminalLine): string => {
  const baseClasses = "animate-pulse duration-75";

  switch (line.type) {
    case 'command':
      return `${baseClasses} text-cyan-400`;
    case 'system':
      return `${baseClasses} text-orange-400 font-bold`;
    case 'separator':
      return `${baseClasses} text-orange-500`;
    case 'error':
      return `${baseClasses} text-red-400`;
    case 'output':
    default:
      return `${baseClasses} text-orange-400`;
  }
};