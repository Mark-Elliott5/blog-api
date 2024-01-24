import { Router } from 'express';
// import jwt from 'jsonwebtoken';
// import mongoose from 'mongoose';
import { authorsList } from '../../controllers/authorsController';
import { commentsList } from '../../controllers/commentsController';

const commentsRouter = Router({ mergeParams: true });

commentsRouter.get('/', commentsList);

export default commentsRouter;
