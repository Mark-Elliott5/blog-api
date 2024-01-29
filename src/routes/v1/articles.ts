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

articlesRouter.put(
  '/:articleUrl',
  passport.authenticate('jwt', { session: false }),
  articleUpdate
);

articlesRouter.delete(
  '/:articleUrl',
  passport.authenticate('jwt', { session: false }),
  articleDelete
);

articlesRouter.get('/:articleUrl', articleGet);

articlesRouter.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  articleCreate
);

articlesRouter.get('/', articlesList);

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
