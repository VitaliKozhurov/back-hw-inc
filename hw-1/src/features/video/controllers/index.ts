import { Request, Response } from 'express';
import { availableResolutionsSet } from '../constants/availableResolutions';
import { HTTP_STATUSES } from '../constants/httpStatuses';
import { videoDB } from '../db/videos';
import { createVideoService } from '../services';
import {
  CreateVideoType,
  UpdateVideoType,
  ValidationError,
} from '../types/types';

export const getAllVideos = (_: Request, res: Response) => {
  return res.status(HTTP_STATUSES.OK).send(videoDB.videos);
};

export const getVideoById = (req: Request<{ id: string }>, res: Response) => {
  const videoId = req.params.id;

  const video = videoDB.videos.find((video) => video.id === Number(videoId));

  if (!video) {
    return res.sendStatus(HTTP_STATUSES.NOT_FOUND);
  }

  return res.status(HTTP_STATUSES.OK).send(video);
};

export const createNewVideo = (
  req: Request<unknown, unknown, CreateVideoType>,
  res: Response,
) => {
  console.log(req.body);

  const { title, author, availableResolutions } = req.body;
  const errors: ValidationError[] = [];

  if (!title || typeof title !== 'string' || title.trim().length === 0) {
    errors.push({
      field: 'title',
      message: 'Title is required and should be a string',
    });
  }

  if (!author || typeof author !== 'string' || author.trim().length === 0) {
    errors.push({
      field: 'author',
      message: 'Author is required and should be a string',
    });
  }

  if (!Array.isArray(availableResolutions)) {
    errors.push({
      field: 'availableResolutions',
      message: 'AvailableResolutions must be array',
    });
  } else if (availableResolutions.length === 0) {
    errors.push({
      field: 'availableResolutions',
      message: 'AvailableResolutions cannot be empty',
    });
  } else {
    for (let resolution of availableResolutions) {
      if (!availableResolutionsSet.has(resolution)) {
        errors.push({
          field: 'availableResolutions',
          message:
            'AvailableResolutions must be one of P144, P240, P360, P480, P720, P1080, P1440, P2160',
        });
        break;
      }
    }
  }

  if (errors.length > 0) {
    return res.status(HTTP_STATUSES.BAD_REQUEST).send(errors);
  }

  const newVideo = createVideoService(req.body);

  return res.status(HTTP_STATUSES.CREATED).send(newVideo);
};

export const updateVideoById = (
  req: Request<{ id: string }, unknown, UpdateVideoType>,
  res: Response,
) => {
  const videoId = req.params.id;

  const video = videoDB.videos.find((video) => video.id === Number(videoId));

  if (!video) {
    return res.sendStatus(HTTP_STATUSES.NOT_FOUND);
  }

  const errors: ValidationError[] = [];

  const {
    title,
    author,
    availableResolutions,
    canBeDownloaded,
    minAgeRestriction,
    publicationDate,
  } = req.body;

  if (!title || typeof title !== 'string' || title.trim().length === 0) {
    errors.push({
      field: 'title',
      message: 'Title is required and should be a string',
    });
  }

  if (!author || typeof author !== 'string' || author.trim().length === 0) {
    errors.push({
      field: 'author',
      message: 'Author is required and should be a string',
    });
  }

  if (!Array.isArray(availableResolutions)) {
    errors.push({
      field: 'availableResolutions',
      message: 'AvailableResolutions must be array',
    });
  } else if (availableResolutions.length === 0) {
    errors.push({
      field: 'availableResolutions',
      message: 'AvailableResolutions cannot be empty',
    });
  } else {
    for (let resolution of availableResolutions) {
      if (!availableResolutionsSet.has(resolution)) {
        errors.push({
          field: 'availableResolutions',
          message:
            'AvailableResolutions must be one of P144, P240, P360, P480, P720, P1080, P1440, P2160',
        });
        break;
      }
    }
  }

  if (!canBeDownloaded || typeof canBeDownloaded !== 'boolean') {
    errors.push({
      field: 'canBeDownloaded',
      message: 'CanBeDownloaded is required and should be a boolean',
    });
  }

  if (
    minAgeRestriction !== null &&
    (typeof minAgeRestriction !== 'number' ||
      minAgeRestriction < 1 ||
      minAgeRestriction > 18)
  ) {
    errors.push({
      field: 'minAgeRestriction',
      message:
        'MinAgeRestriction is required and should be a number between 1 and 18',
    });
  }

  if (!publicationDate) {
    errors.push({
      field: 'publicationDate',
      message: 'PublicationDate is required',
    });
  } else if (
    !isNaN(new Date(publicationDate).getTime()) &&
    new Date(publicationDate).toISOString() === publicationDate
  ) {
    errors.push({
      field: 'publicationDate',
      message: 'PublicationDate is invalid',
    });
  }

  if (errors.length > 0) {
    return res.status(HTTP_STATUSES.BAD_REQUEST).send(errors);
  }

  const updatedVideoDB = videoDB.videos.map((video) => {
    return video.id === Number(videoId)
      ? {
          ...video,
          ...req.body,
        }
      : video;
  });

  videoDB.videos = updatedVideoDB;

  return res.sendStatus(HTTP_STATUSES.NO_CONTENT);
};

export const deleteVideoById = (
  req: Request<{ id: string }>,
  res: Response,
) => {
  const videoId = req.params.id;

  const video = videoDB.videos.find((video) => video.id === Number(videoId));

  if (!video) {
    return res.sendStatus(HTTP_STATUSES.NOT_FOUND);
  }

  const updatedVideo = videoDB.videos.filter(
    (video) => video.id !== Number(videoId),
  );

  videoDB.videos = updatedVideo;

  return res.sendStatus(HTTP_STATUSES.NO_CONTENT);
};

export const clearVideoDB = (_: Request, res: Response) => {
  videoDB.videos = [];

  return res.sendStatus(HTTP_STATUSES.NO_CONTENT);
};
