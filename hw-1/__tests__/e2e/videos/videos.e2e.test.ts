import express from 'express';
import { initApp } from './../../../src/init-app';

import { Server } from 'http';
import request from 'supertest';
import { HTTP_STATUSES } from '../../../src/features/video/constants/httpStatuses';
import {
  CreateVideoType,
  UpdateVideoType,
  VideoResolution,
} from '../../../src/features/video/types/types';

describe('Videos', () => {
  const app = express();
  let server: Server;

  beforeAll(async () => {
    server = await initApp(app);
  });

  beforeEach(async () => {
    await request(app)
      .delete('/testing/all-data')
      .expect(HTTP_STATUSES.NO_CONTENT);
  });

  it('should return all videos from db', async () => {
    const result = await request(app).get('/videos').expect(HTTP_STATUSES.OK);

    expect(result.body).toEqual([]);
  });

  it('should create new video', async () => {
    const videoEntity: CreateVideoType = {
      title: 'title',
      author: 'author',
      availableResolutions: [
        VideoResolution.P144,
        VideoResolution.P360,
        VideoResolution.P720,
      ],
    };

    await request(app)
      .post('/videos')
      .send(videoEntity)
      .expect(HTTP_STATUSES.CREATED);

    const result = await request(app).get('/videos').expect(HTTP_STATUSES.OK);

    expect(result.body).toHaveLength(1);

    expect(result.body[0].title).toBe(videoEntity.title);
    expect(result.body[0].author).toBe(videoEntity.author);
    expect(result.body[0].availableResolutions).toHaveLength(3);
  });

  it('should not create new video, with incorrect data', async () => {
    const videoEntity: CreateVideoType = {
      title:
        'very_long_title_very_long_title_very_long_title_very_long_title_very_long_title_very_long_title_very_long_title',
      author:
        'very_long_author_very_long_author_very_long_author_very_long_author_very_long_author_very_long_author',
      availableResolutions: [VideoResolution.P144],
    };

    const result = await request(app)
      .post('/videos')
      .send(videoEntity)
      .expect(HTTP_STATUSES.BAD_REQUEST);

    expect(result.body).toEqual({
      errorsMessages: [
        {
          message: expect.any(String),
          field: 'title',
        },
        {
          message: expect.any(String),
          field: 'author',
        },
      ],
    });
  });

  it('should return video by id', async () => {
    const videoEntity: CreateVideoType = {
      title: 'first video',
      author: 'author',
      availableResolutions: [VideoResolution.P144],
    };

    await request(app)
      .post('/videos')
      .send(videoEntity)
      .expect(HTTP_STATUSES.CREATED);

    const video = await request(app).get('/videos/1').expect(HTTP_STATUSES.OK);

    expect(video.body.title).toEqual(videoEntity.title);
  });

  it('should remove video by id', async () => {
    const videoEntity: CreateVideoType = {
      title: 'title',
      author: 'author',
      availableResolutions: [VideoResolution.P144],
    };

    await request(app)
      .post('/videos')
      .send(videoEntity)
      .expect(HTTP_STATUSES.CREATED);

    const videos = await request(app).get('/videos').expect(HTTP_STATUSES.OK);

    const videoId = videos.body[0].id;

    expect(videoId).toBe(1);

    await request(app)
      .delete(`/videos/${videoId}`)
      .expect(HTTP_STATUSES.NO_CONTENT);

    const result = await request(app).get('/videos').expect(HTTP_STATUSES.OK);

    expect(result.body).toHaveLength(0);
  });

  it('should not remove video by id', async () => {
    const videoEntity: CreateVideoType = {
      title: 'title',
      author: 'author',
      availableResolutions: [VideoResolution.P144],
    };

    await request(app)
      .post('/videos')
      .send(videoEntity)
      .expect(HTTP_STATUSES.CREATED);

    const videos = await request(app).get('/videos').expect(HTTP_STATUSES.OK);

    const videoId = videos.body[0].id;

    expect(videos.body).toHaveLength(1);
    expect(videoId).toBe(1);

    await request(app).delete(`/videos/100`).expect(HTTP_STATUSES.NOT_FOUND);

    const result = await request(app).get('/videos').expect(HTTP_STATUSES.OK);

    expect(result.body).toHaveLength(1);
  });

  it('should update video', async () => {
    const videoEntity: CreateVideoType = {
      title: 'first video',
      author: 'author',
      availableResolutions: [VideoResolution.P144],
    };

    await request(app)
      .post('/videos')
      .send(videoEntity)
      .expect(HTTP_STATUSES.CREATED);

    const { body } = await request(app)
      .get('/videos/1')
      .expect(HTTP_STATUSES.OK);

    const newVideo: UpdateVideoType = { ...body, title: 'updated title' };

    await request(app)
      .put('/videos/1')
      .send(newVideo)
      .expect(HTTP_STATUSES.NO_CONTENT);

    const result = await request(app).get('/videos/1').expect(HTTP_STATUSES.OK);

    expect(result.body.title).toBe(newVideo.title);
  });

  it('should not update video', async () => {
    const videoEntity: CreateVideoType = {
      title: 'first video',
      author: 'author',
      availableResolutions: [VideoResolution.P144],
    };

    await request(app)
      .post('/videos')
      .send(videoEntity)
      .expect(HTTP_STATUSES.CREATED);

    const { body } = await request(app)
      .get('/videos/1')
      .expect(HTTP_STATUSES.OK);

    const newVideo = {
      ...body,
      title:
        'very long updated title very long updated title very long updated title very long updated title very long updated title very long updated title very long updated title',
      author:
        'very_long_author_very_long_author_very_long_author_very_long_author_very_long_author_very_long_author',
      publicationDate: 100,
    };

    const result = await request(app)
      .put('/videos/1')
      .send(newVideo)
      .expect(HTTP_STATUSES.BAD_REQUEST);

    expect(result.body).toEqual({
      errorsMessages: [
        {
          message: expect.any(String),
          field: 'title',
        },
        {
          message: expect.any(String),
          field: 'author',
        },
        {
          message: expect.any(String),
          field: 'publicationDate',
        },
      ],
    });
  });

  afterAll(() => {
    server.close();
  });
});
