import express from 'express';
import { videoRouter } from './features/video/routes';

const PORT = process.env.PORT || 5001;

const app = express();

// app.use(express.json());

app.get('/', (req, res) => {
  res.send('Home work №1 - video service');
});

app.use('/videos', videoRouter);

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
