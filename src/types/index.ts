
export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
  category: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  time: string;
  duration?: string;
}
