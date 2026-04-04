export type MessageRole = 'user' | 'assistant';

export type ScheduleActionType =
  | 'FILL_SHIFT'
  | 'FILL_DAY'
  | 'FILL_WEEK'
  | 'SWAP_WORKER'
  | 'CLEAR_SHIFT'
  | 'SHOW_WORKERS'
  | 'SHOW_GAPS'
  | 'LIST_AVAILABLE'
  | 'SET_REQUIREMENT'
  | 'CLEAR_SHIFT_OVERRIDES'
  | 'UNKNOWN';

export interface ScheduleAction {
  type: ScheduleActionType;
  date?: string;
  shift?: string;
  workerName?: string;
}

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: string;
  action?: ScheduleAction;
}

export interface ChatRequest {
  message: string;
  weekOffset?: number;
}

export interface ChatResponse {
  reply: string;
  action?: ScheduleAction;
  scheduleUpdated: boolean;
}
