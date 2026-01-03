import express, { Express } from 'express';
import { Server } from 'http';
import { testingRouter, videoRouter } from './features/video/routes';

const PORT = process.env.PORT || 5001;

export const initApp = (app: Express): Promise<Server> => {
  app.use(express.json());

  app.get('/', (_, res) => {
    res.send('Home work №1 - video service');
  });

  app.use('/videos', videoRouter);
  app.use('/testing', testingRouter);

  return new Promise((resolve) => {
    const server = app.listen(PORT, () => {
      console.log(`Example app listening on port ${PORT}`);
      resolve(server);
    });
  });
};
