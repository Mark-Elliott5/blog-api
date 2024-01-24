import { Router } from 'express';
// import jwt from 'jsonwebtoken';
// import mongoose from 'mongoose';
import {
  commentCreate,
  commentDelete,
  commentGet,
  commentUpdate,
  commentsList,
} from '../../controllers/commentsController';

const commentsRouter = Router({ mergeParams: true });

commentsRouter.get('/:commentUrl', commentGet);

commentsRouter.put('/:commentUrl', commentUpdate);

commentsRouter.delete('/:commentUrl', commentDelete);

commentsRouter.get('/', commentsList);

commentsRouter.post('/', commentCreate);

export default commentsRouter;
