import { Request, Response } from 'express';
import { HTTP_STATUSES } from '../constants/httpStatuses';
import { videoDB } from '../db/videos';
import { createVideoService } from '../services/createVideoService';
import {
  caBeDownloadedValidation,
  minAgeRestrictionValidation,
  publicationDateValidation,
  stringFieldValidation,
  videoResolutionValidation,
} from '../services/validation';
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
  const { title, author, availableResolutions } = req.body;
  const errors: ValidationError[] = [];

  const titleValidationResult = stringFieldValidation({
    field: title,
    fieldName: 'title',
    maxLength: 40,
  });
  if (titleValidationResult) {
    errors.push(titleValidationResult);
  }

  const authorValidationResult = stringFieldValidation({
    field: author,
    fieldName: 'author',
    maxLength: 20,
  });
  if (authorValidationResult) {
    errors.push(authorValidationResult);
  }

  const availableResolutionsValidationResult =
    videoResolutionValidation(availableResolutions);
  if (availableResolutionsValidationResult) {
    errors.push(availableResolutionsValidationResult);
  }

  if (errors.length > 0) {
    return res
      .status(HTTP_STATUSES.BAD_REQUEST)
      .send({ errorsMessages: errors });
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

  const titleValidationResult = stringFieldValidation({
    field: title,
    fieldName: 'title',
    maxLength: 40,
  });
  if (titleValidationResult) {
    errors.push(titleValidationResult);
  }

  const authorValidationResult = stringFieldValidation({
    field: author,
    fieldName: 'author',
    maxLength: 20,
  });
  if (authorValidationResult) {
    errors.push(authorValidationResult);
  }

  const availableResolutionsValidationResult =
    videoResolutionValidation(availableResolutions);
  if (availableResolutionsValidationResult) {
    errors.push(availableResolutionsValidationResult);
  }

  const canBeDownloadedValidationResult =
    caBeDownloadedValidation(canBeDownloaded);
  if (canBeDownloadedValidationResult) {
    errors.push(canBeDownloadedValidationResult);
  }

  const minAgeRestrictionValidationResult =
    minAgeRestrictionValidation(minAgeRestriction);
  if (minAgeRestrictionValidationResult) {
    errors.push(minAgeRestrictionValidationResult);
  }

  const publicationDateValidationResult =
    publicationDateValidation(publicationDate);
  if (publicationDateValidationResult) {
    errors.push(publicationDateValidationResult);
  }

  if (errors.length > 0) {
    return res
      .status(HTTP_STATUSES.BAD_REQUEST)
      .send({ errorsMessages: errors });
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
