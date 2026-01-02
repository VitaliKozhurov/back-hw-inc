import { Router } from 'express';
import {
  clearVideoDB,
  createNewVideo,
  deleteVideoById,
  getAllVideos,
  getVideoById,
  updateVideoById,
} from '../controllers';

export const videoRouter = Router();

videoRouter
  .get('/', getAllVideos)
  .get('/:id', getVideoById)
  .post('/', createNewVideo)
  .put('/:id', updateVideoById)
  .delete('/:id', deleteVideoById)
  .delete('/testing/all-data', clearVideoDB);
