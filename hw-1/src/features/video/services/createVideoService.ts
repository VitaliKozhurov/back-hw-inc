import { videoDB } from '../db/videos';
import { CreateVideoType, VideoDTO } from '../types/types';

export const createVideoService = (data: CreateVideoType) => {
  const createdAt = new Date();

  const createdVideo: VideoDTO = {
    id: videoDB.videos.length + 1,
    createdAt: new Date().toISOString(),
    publicationDate: new Date(
      createdAt.getTime() + 24 * 60 * 60 * 1000,
    ).toISOString(),
    canBeDownloaded: false,
    minAgeRestriction: null,
    ...data,
  };

  videoDB.videos.push(createdVideo);

  return createdVideo;
};
