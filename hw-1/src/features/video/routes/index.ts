import { Router } from 'express';
import { getAllVideos } from '../controllers';

export const videoRouter = Router();

videoRouter.get('/', getAllVideos);
