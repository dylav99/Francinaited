
export enum AppMode {
  GENERATE = 'GENERATE',
  REMIX = 'REMIX',
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
