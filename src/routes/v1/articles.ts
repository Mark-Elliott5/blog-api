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
import passport from 'passport';

const articlesRouter = Router();

articlesRouter.use('/:articleUrl/comments', commentsRouter);

articlesRouter.get('/:articleUrl', articleGet);

articlesRouter.put('/:articleUrl', articleUpdate);

articlesRouter.delete('/:articleUrl', articleDelete);

articlesRouter.get('/', articlesList);

articlesRouter.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  articleCreate
);

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
