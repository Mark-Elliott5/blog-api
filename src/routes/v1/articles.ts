import { Router } from 'express';
// import jwt from 'jsonwebtoken';
// import mongoose from 'mongoose';
import {
  articleCreate,
  articleDelete,
  articleGet,
  articleUpdate,
  articlesList,
} from '../../controllers/articlesController';
import commentsRouter from './comments';

const articlesRouter = Router();

articlesRouter.use('/:articleTitle/comments', commentsRouter);

articlesRouter.get('/:articleTitle', articleGet);

articlesRouter.put('/:articleTitle', articleUpdate);

articlesRouter.delete('/:articleTitle', articleDelete);

articlesRouter.get('/:articleTitle', articleGet);

articlesRouter.get('/', articlesList);

articlesRouter.post('/', articleCreate);

// .populate([
//   {
//     path: 'comments',
//   },
//   {
//     path: 'author',
//     select: 'name',
//   },
// ])

export default articlesRouter;
