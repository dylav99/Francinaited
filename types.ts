
export enum AppMode {
  GENERATE = 'GENERATE',
  REMIX = 'REMIX',
  HISTORY = 'HISTORY',
}

export enum AspectRatio {
  SQUARE = '1:1',
  PORTRAIT = '3:4',
  LANDSCAPE = '16:9',
}

export interface StylePreset {
  id: string;
  name: string;
  prompt_suffix: string;
  thumbnail: string;
}

export interface StoredImage {
  id: string;
  imageDataUrl: string;
  prompt: string;
  timestamp: number;
  type: 'generate' | 'remix';
  aspectRatio?: AspectRatio;
}
