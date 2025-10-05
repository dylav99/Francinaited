export enum AppMode {
  GENERATE = 'generate',
  REMIX = 'remix',
}

export interface ImageHistoryItem {
  id: string;
  src: string; // The full data URL
  timestamp: number;
}
