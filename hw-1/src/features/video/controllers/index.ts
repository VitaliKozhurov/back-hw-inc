import { Request, Response } from 'express';
import { HTTP_STATUSES } from '../constants/httpStatuses';
import { videoDB } from '../db/videos';

export const getAllVideos = (_: Request, res: Response) => {
  res.status(HTTP_STATUSES.OK).send(videoDB);
};
