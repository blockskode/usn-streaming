export type GeneratorType = 'ecommerce' | 'iot' | 'social' | 'financial';

export interface Generator {
  id: GeneratorType;
  name: string;
  icon: string;
  description: string;
  topic: string;
}

export interface GeneratorStatus {
  status: 'running' | 'stopped';
  topic: string;
  messagesPerSec?: number;
  messageCount?: number;
  startedAt?: any;
  stoppedAt?: any;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  environment: 'python' | 'databricks';
  starterCode: string;
  successCriteria: string[];
  aiTips: string[];
}

export interface UserProgress {
  completedChallenges: string[];
  tutorialProgress: Record<string, boolean>;
  currentChallenge?: string;
}
