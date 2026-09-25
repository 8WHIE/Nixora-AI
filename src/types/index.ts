export type NavigationTab = 'chat' | 'codestudio' | 'sandbox' | 'apkhub' | 'settings';

export type ViewMode = 'phone' | 'full' | 'tablet';

export type ProgrammingLanguage = 
  | 'python'
  | 'java'
  | 'javascript'
  | 'typescript'
  | 'cpp'
  | 'html'
  | 'css'
  | 'react'
  | 'kotlin'
  | 'sql'
  | 'rust'
  | 'go';

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: string;
  isStreaming?: boolean;
  codeBlocks?: Array<{
    language: string;
    code: string;
  }>;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: string;
  updatedAt: string;
}

export interface LineExplanation {
  lineNumber: number;
  code: string;
  explanation: string;
  importance: 'high' | 'normal' | 'setup';
}

export interface LineByLineResult {
  overview: string;
  timeComplexity: string;
  spaceComplexity: string;
  lines: LineExplanation[];
}

export interface DebugResult {
  fixedCode: string;
  bugType: string;
  explanation: string;
  diffSummary: string[];
  performanceTip: string;
}

export interface DsaResult {
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  intuition: string;
  approach: string;
  timeComplexity: string;
  spaceComplexity: string;
  solutionCode: string;
  edgeCases: string[];
  testCases: Array<{
    input: string;
    expectedOutput: string;
    explanation: string;
  }>;
}

export interface ProjectFile {
  path: string;
  language: string;
  content: string;
  description: string;
}

export interface GeneratedProject {
  projectName: string;
  description: string;
  techStack: string[];
  instructions: string;
  files: ProjectFile[];
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string;
  isGuest: boolean;
  stats: {
    promptsCount: number;
    codeSnippetsCount: number;
    projectsExported: number;
    streakDays: number;
  };
  badges: string[];
}

export interface AppSettings {
  model: string;
  temperature: number;
  persona: 'architect' | 'dsa' | 'android' | 'fullstack' | 'debugger';
  theme: 'futuristic-dark' | 'deep-oled' | 'cyber-neon';
  language: string;
  speechVoice: string;
  speechRate: number;
  speechPitch: number;
  autoSpeakResponse: boolean;
  hapticFeedback: boolean;
}
