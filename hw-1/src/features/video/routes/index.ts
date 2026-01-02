import { Router } from 'express';
import {
  clearVideoDB,
  createNewVideo,
  deleteVideoById,
  getAllVideos,
  getVideoById,
} from '../controllers';

export const videoRouter = Router();

videoRouter
  .get('/', getAllVideos)
  .get('/:id', getVideoById)
  .post('/', createNewVideo)
  .delete('/:id', deleteVideoById)
  .delete('/all-data', clearVideoDB);
