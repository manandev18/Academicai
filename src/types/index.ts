export interface User {
  uid: string;
  email: string;
  displayName?: string;
}

export interface Assignment {
  id: string;
  userId: string;
  prompt: string;
  breakdown: string;
  feedback: string;
  timestamp: Date;
}

export interface AIDetectionResult {
  confidence: 'High' | 'Medium' | 'Low';
  explanation: string;
  indicator: string;
}

export interface AIDetectionReport {
  id: string;
  userId: string;
  text: string;
  confidence: string;
  explanation: string;
  indicator: string;
  timestamp: Date;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, displayName: string) => Promise<void>;
  logout: () => Promise<void>;
}