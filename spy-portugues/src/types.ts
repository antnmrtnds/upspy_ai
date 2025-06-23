export interface Ad {
  title?: string;
  creative: string;
  creativeType: 'image' | 'video';
  metadata?: { date?: string; platform?: string };
  metrics?: { likes?: number; shares?: number };
} 