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

export const terminalCommands: Record<string, TerminalCommand> = {
  test: {
    name: 'test',
    description: 'Test command to verify terminal is working',
    usage: 'test',
    aliases: ['t'],
    execute: (): CommandResult => ({
      lines: [
        createLine("🧪 Terminal test successful!", 'success'),
        createLine("✅ Input is working", 'success'),
        createLine("✅ Commands are executing", 'success'),
        createLine("✅ Display is functioning", 'success'),
        createLine(""),
        createLine("If you can see this, the terminal is working correctly!", 'info'),
        createLine(""),
      ],
      shouldClose: false,
      shouldClear: false,
      exitCode: 0,
    }),
  },

  help: {
    name: 'help',
    description: 'Show available commands',
    usage: 'help',
    aliases: ['h', '?', 'man'],
    execute: (): CommandResult => ({
      lines: [
        createLine("NAME", 'system'),
        createLine("       portfolio-shell - interactive CV navigation system", 'output'),
        createLine("", 'output'),
        createLine("AVAILABLE COMMANDS", 'system'),
        createLine("  cat <file>   - Display file contents"),
        createLine("  cd <dir>     - Change directory"),
        createLine("  clear        - Clear terminal screen"),
        createLine("  echo <text>  - Display a line of text"),
        createLine("  help         - Show this help message"),
        createLine("  history      - Show command history"),
        createLine("  ls [-la]     - List directory contents"),
        createLine("  pwd          - Print working directory"),
        createLine("  skills       - Display technical expertise"),
        createLine("  sudo <cmd>   - Execute command with privileges"),
        createLine("  uname -a     - System information"),
        createLine("  whoami       - Display current user"),
        createLine("  exit         - Close terminal"),
        createLine("", 'output'),
        createLine("NAVIGATION", 'system'),
        createLine("  Use Tab for autocompletion", 'info'),
        createLine("  Use ↑/↓ for command history", 'info'),
        createLine("  Ctrl+L or 'clear' to clear screen", 'info'),
        createLine("", 'output'),
      ],
      shouldClose: false,
      shouldClear: false,
      exitCode: 0,
    }),
  },

  clear: {
    name: 'clear',
    description: 'Clear terminal screen',
    usage: 'clear',
    aliases: ['cls'],
    execute: (): CommandResult => ({
      lines: [],
      shouldClose: false,
      shouldClear: true,
      exitCode: 0,
    }),
  },

  about: {
    name: 'about',
    description: 'About this system',
    usage: 'about',
    aliases: ['info'],
    execute: (): CommandResult => ({
      lines: [
        createLine("CYBERNETIC PORTFOLIO SYSTEM v5.0.1", 'system'),
        createLine("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━", 'separator'),
        createLine("Architecture: React 18 + TypeScript + Vite", 'output'),
        createLine("Styling: Tailwind CSS with cybernetic design system", 'output'),
        createLine("State Management: Advanced Context + useReducer", 'output'),
        createLine("Error Handling: Comprehensive boundary system", 'output'),
        createLine("Performance: Optimized with React.memo and useMemo", 'output'),
        createLine("", 'output'),
        createLine("Portfolio of JC LAMY - Senior Full Stack Developer", 'info'),
        createLine("Based in Paris, France", 'info'),
        createLine("15+ years of experience in modern web development", 'info'),
        createLine("", 'output'),
        createLine("Built with precision and attention to detail", 'info'),
        createLine("", 'output'),
      ],
      shouldClose: false,
      shouldClear: false,
      exitCode: 0,
    }),
  },

  skills: {
    name: 'skills',
    description: 'Display technical skills',
    usage: 'skills [category]',
    aliases: ['tech', 'stack'],
    execute: (args: readonly string[]): CommandResult => {
      const category = args[0]?.toLowerCase();

      if (category === 'frontend') {
        return {
          lines: [
            createLine("FRONTEND EXPERTISE", 'system'),
            createLine("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━", 'separator'),
            createLine("⚛️  React 18 (Hooks, Context, Suspense, Concurrent Features)"),
            createLine("📘 TypeScript (Advanced types, Generics, Conditional types)"),
            createLine("⚡ Next.js (SSR, SSG, App Router, Edge Functions)"),
            createLine("🎨 CSS-in-JS (Styled Components, Emotion)"),
            createLine("🎯 State Management (Redux Toolkit, Zustand, Jotai)"),
            createLine("🧪 Testing (Jest, React Testing Library, Cypress)"),
            createLine(""),
          ],
          shouldClose: false,
          shouldClear: false,
          exitCode: 0,
        };
      }

      return {
        lines: [
          createLine("TECHNICAL SKILLS OVERVIEW", 'system'),
          createLine("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━", 'separator'),
          createLine("🎯 Frontend: React, TypeScript, Next.js, Vue.js"),
          createLine("⚙️  Backend: Node.js, Python, Go, Java"),
          createLine("🗄️  Database: PostgreSQL, MongoDB, Redis, Elasticsearch"),
          createLine("☁️  Cloud: AWS, GCP, Docker, Kubernetes"),
          createLine("🔧 DevOps: CI/CD, Terraform, Monitoring"),
          createLine("📱 Mobile: React Native, Flutter"),
          createLine(""),
          createLine("💡 Use 'skills frontend' for detailed frontend skills"),
          createLine(""),
        ],
        shouldClose: false,
        shouldClear: false,
        exitCode: 0,
      };
    },
  },

  contact: {
    name: 'contact',
    description: 'Show contact information',
    usage: 'contact',
    aliases: ['email', 'reach'],
    execute: (): CommandResult => ({
      lines: [
        createLine("CONTACT INFORMATION", 'system'),
        createLine("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━", 'separator'),
        createLine("📧 Email: lamypro66@gmail.com"),
        createLine("🌍 Location: Paris, France"),
        createLine("💼 LinkedIn: /in/jc-lamy"),
        createLine("🐙 GitHub: /jc-lamy"),
        createLine("🌐 Website: jc-lamy.dev"),
        createLine(""),
        createLine("💻 Remote work: Available worldwide"),
        createLine("🚀 Status: Open to exciting opportunities"),
        createLine("⏰ Response time: Usually within 24h"),
        createLine(""),
      ],
      shouldClose: false,
      shouldClear: false,
      exitCode: 0,
    }),
  },

  projects: {
    name: 'projects',
    description: 'List recent projects',
    usage: 'projects [filter]',
    aliases: ['work', 'portfolio'],
    execute: (): CommandResult => ({
      lines: [
        createLine("FEATURED PROJECTS", 'system'),
        createLine("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━", 'separator'),
        createLine("🎯 1. Cybernetic Portfolio (2024)"),
        createLine("     → Advanced React/TS terminal interface"),
        createLine("     → Custom error boundaries & performance optimization"),
        createLine(""),
        createLine("🚀 2. E-commerce Platform (2023)"),
        createLine("     → Microservices architecture with Node.js"),
        createLine("     → Real-time inventory & payment processing"),
        createLine(""),
        createLine("📊 3. Analytics Dashboard (2023)"),
        createLine("     → Real-time data visualization with D3.js"),
        createLine("     → WebSocket connections & streaming data"),
        createLine(""),
        createLine("📱 4. Cross-Platform Mobile App (2022)"),
        createLine("     → React Native with native module integration"),
        createLine("     → 50k+ active users, 4.8★ rating"),
        createLine(""),
      ],
      shouldClose: false,
      shouldClear: false,
      exitCode: 0,
    }),
  },

  whoami: {
    name: 'whoami',
    description: 'Display current user information',
    usage: 'whoami',
    aliases: ['user', 'me'],
    execute: (): CommandResult => ({
      lines: [
        createLine("USER INFORMATION", 'system'),
        createLine("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━", 'separator'),
        createLine("👤 Name: JC LAMY"),
        createLine("💼 Role: Senior Full Stack Developer"),
        createLine("🏢 Experience: 15+ years"),
        createLine("📍 Location: Paris, France"),
        createLine("🎯 Specialization: React, TypeScript, Node.js"),
        createLine("🌟 Passion: Creating beautiful, performant web experiences"),
        createLine(""),
      ],
      shouldClose: false,
      shouldClear: false,
      exitCode: 0,
    }),
  },

  ls: {
    name: 'ls',
    description: 'List directory contents',
    usage: 'ls [options]',
    aliases: ['dir', 'list'],
    execute: (): CommandResult => ({
      lines: [
        createLine("DIRECTORY CONTENTS", 'system'),
        createLine("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━", 'separator'),
        createLine("📁 projects/          - Recent work and side projects"),
        createLine("📁 skills/            - Technical expertise and certifications"),
        createLine("📁 experience/        - Professional work history"),
        createLine("📁 education/         - Academic background"),
        createLine("📄 resume.pdf         - Comprehensive CV"),
        createLine("📄 contact.md         - Contact information"),
        createLine("📄 README.md          - About this portfolio"),
        createLine(""),
        createLine("Total: 7 items"),
        createLine(""),
      ],
      shouldClose: false,
      shouldClear: false,
      exitCode: 0,
    }),
  },

  pwd: {
    name: 'pwd',
    description: 'Show current working directory',
    usage: 'pwd',
    aliases: ['path'],
    execute: (): CommandResult => ({
      lines: [
        createLine("/home/jc-lamy/portfolio", 'output'),
        createLine(""),
      ],
      shouldClose: false,
      shouldClear: false,
      exitCode: 0,
    }),
  },

  exit: {
    name: 'exit',
    description: 'Close terminal',
    usage: 'exit',
    aliases: ['quit', 'bye', 'logout'],
    execute: (): CommandResult => ({
      lines: [
        createLine("Connection to isha-portfolio closed.", 'system'),
        createLine("logout", 'system'),
        createLine(""),
      ],
      shouldClose: true,
      shouldClear: false,
      exitCode: 0,
    }),
  },

  // Additional Linux-style commands
  cat: {
    name: 'cat',
    description: 'Display file contents',
    usage: 'cat <filename>',
    aliases: ['type', 'more'],
    execute: (args: readonly string[]): CommandResult => {
      if (args.length === 0) {
        return {
          lines: [
            createLine("cat: missing file operand", 'error'),
            createLine("Try 'cat --help' for more information.", 'info'),
            createLine(""),
          ],
          shouldClose: false,
          shouldClear: false,
          exitCode: 1,
        };
      }

      const filename = args[0]?.toLowerCase();

      switch (filename) {
        case 'readme.md':
          return {
            lines: [
              createLine("# Isha Atari - Portfolio", 'output'),
              createLine("", 'output'),
              createLine("Senior Full Stack Developer specializing in modern web technologies.", 'output'),
              createLine("This interactive terminal showcases my skills and experience.", 'output'),
              createLine("", 'output'),
              createLine("## Quick Navigation", 'output'),
              createLine("- `ls` - Browse available content", 'output'),
              createLine("- `skills` - Technical expertise", 'output'),
              createLine("- `contact` - Get in touch", 'output'),
              createLine(""),
            ],
            shouldClose: false,
            shouldClear: false,
            exitCode: 0,
          };

        case 'contact.md':
          return {
            lines: [
              createLine("# Contact Information", 'output'),
              createLine("", 'output'),
              createLine("Email: isha.atari@example.com", 'output'),
              createLine("Location: Paris, France", 'output'),
              createLine("LinkedIn: /in/isha-atari", 'output'),
              createLine("GitHub: /isha-atari", 'output'),
              createLine(""),
            ],
            shouldClose: false,
            shouldClear: false,
            exitCode: 0,
          };

        case 'resume.pdf':
          return {
            lines: [
              createLine("cat: resume.pdf: binary file matches", 'warning'),
              createLine("Use 'skills' command to view technical expertise", 'info'),
              createLine(""),
            ],
            shouldClose: false,
            shouldClear: false,
            exitCode: 0,
          };

        default:
          return {
            lines: [
              createLine(`cat: ${filename}: No such file or directory`, 'error'),
              createLine("Try 'ls' to see available files", 'info'),
              createLine(""),
            ],
            shouldClose: false,
            shouldClear: false,
            exitCode: 1,
          };
      }
    },
  },

  echo: {
    name: 'echo',
    description: 'Display a line of text',
    usage: 'echo <text>',
    aliases: [],
    execute: (args: readonly string[]): CommandResult => ({
      lines: [
        createLine(args.join(' ') || '', 'output'),
        createLine(""),
      ],
      shouldClose: false,
      shouldClear: false,
      exitCode: 0,
    }),
  },

  history: {
    name: 'history',
    description: 'Show command history',
    usage: 'history',
    aliases: ['hist'],
    execute: (): CommandResult => ({
      lines: [
        createLine("Command history is managed by the terminal interface", 'info'),
        createLine("Use ↑/↓ arrow keys to navigate through previous commands", 'info'),
        createLine(""),
      ],
      shouldClose: false,
      shouldClear: false,
      exitCode: 0,
    }),
  },

  cd: {
    name: 'cd',
    description: 'Change directory',
    usage: 'cd <directory>',
    aliases: ['chdir'],
    execute: (args: readonly string[]): CommandResult => {
      const target = args[0] || '~';

      const validDirs = ['~', '/', '/home', '/home/isha', '/home/isha/portfolio', 'projects', 'skills', '..'];

      if (validDirs.some(dir => target.includes(dir.replace('isha', 'isha')))) {
        return {
          lines: [
            createLine(`Changed to directory: ${target === '~' ? '/home/isha/portfolio' : target}`, 'success'),
            createLine(""),
          ],
          shouldClose: false,
          shouldClear: false,
          exitCode: 0,
        };
      }

      return {
        lines: [
          createLine(`cd: ${target}: No such file or directory`, 'error'),
          createLine("Available directories: projects, skills", 'info'),
          createLine(""),
        ],
        shouldClose: false,
        shouldClear: false,
        exitCode: 1,
      };
    },
  },

  'uname': {
    name: 'uname',
    description: 'System information',
    usage: 'uname [-a]',
    aliases: ['sysinfo'],
    execute: (args: readonly string[]): CommandResult => {
      const showAll = args.includes('-a') || args.includes('--all');

      if (showAll) {
        return {
          lines: [
            createLine("Linux portfolio-system 5.19.0-cybernetic #1 SMP PREEMPT_DYNAMIC", 'output'),
            createLine("x86_64 x86_64 x86_64 GNU/Linux", 'output'),
            createLine("Built with React 18 + TypeScript + Vite", 'info'),
            createLine(""),
          ],
          shouldClose: false,
          shouldClear: false,
          exitCode: 0,
        };
      }

      return {
        lines: [
          createLine("Linux", 'output'),
          createLine(""),
        ],
        shouldClose: false,
        shouldClear: false,
        exitCode: 0,
      };
    },
  },

  sudo: {
    name: 'sudo',
    description: 'Execute command with elevated privileges',
    usage: 'sudo <command>',
    aliases: [],
    execute: (args: readonly string[]): CommandResult => {
      if (args.length === 0) {
        return {
          lines: [
            createLine("sudo: a command is required", 'error'),
            createLine(""),
          ],
          shouldClose: false,
          shouldClear: false,
          exitCode: 1,
        };
      }

      // Handle some fun sudo commands
      const command = args.join(' ');

      if (command.includes('rm') && (command.includes('-rf') || command.includes('/*'))) {
        return {
          lines: [
            createLine("[sudo] password for isha: ", 'system'),
            createLine("sudo: rm: command not found (for safety reasons)", 'error'),
            createLine("This is a portfolio, not a real system! 😉", 'warning'),
            createLine(""),
          ],
          shouldClose: false,
          shouldClear: false,
          exitCode: 1,
        };
      }

      return {
        lines: [
          createLine("[sudo] password for isha: ", 'system'),
          createLine("Authentication successful", 'success'),
          createLine(`Executing: ${command}`, 'info'),
          createLine("sudo: This is a portfolio demo - commands are simulated", 'warning'),
          createLine(""),
        ],
        shouldClose: false,
        shouldClear: false,
        exitCode: 0,
      };
    },
  },
};

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