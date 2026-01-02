import { videoDB } from '../db/videos';
import { CreateVideoType, VideoDTO } from '../types/types';

export const createVideoService = (data: CreateVideoType) => {
  const createdVideo: VideoDTO = {
    id: videoDB.videos.length + 1,
    createdAt: new Date().toISOString(),
    publicationDate: new Date().toISOString(),
    canBeDownloaded: false,
    minAgeRestriction: null,
    ...data,
  };

  videoDB.videos.push(createdVideo);

  return createdVideo;
};
