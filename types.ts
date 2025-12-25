
export interface VideoFile {
  id: string;
  file: File;
  previewUrl: string;
  duration: number;
  status: 'pending' | 'processing' | 'completed' | 'error';
}

export interface ProcessingResult {
  title: string;
  description: string;
  hashtags: string[];
  viralScore: number;
  platforms: {
    youtube: { title: string; tags: string[] };
    tiktok: { caption: string; tags: string[] };
  };
  highlightSegments: Array<{ start: number; end: number; description: string }>;
  originalDuration: number;
  targetDuration: number;
}

export enum AppState {
  UPLOAD = 'UPLOAD',
  PROCESSING = 'PROCESSING',
  RESULT = 'RESULT'
}
