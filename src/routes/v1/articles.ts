import { Router } from 'express';
// import jwt from 'jsonwebtoken';
// import mongoose from 'mongoose';
import { articleGet, articlesList } from '../../controllers/articlesController';
import commentsRouter from './comments';

const articlesRouter = Router();

articlesRouter.use('/:articleTitle/comments', commentsRouter);

articlesRouter.get('/:articleTitle', articleGet);

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
