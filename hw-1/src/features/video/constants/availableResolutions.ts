import { VideoResolution } from '../types/types';

type Resolutions = keyof typeof VideoResolution;

export const availableResolutionsSet: Set<Resolutions> = new Set([
  'P144',
  'P240',
  'P360',
  'P480',
  'P720',
  'P1080',
  'P1440',
  'P2160',
]);
