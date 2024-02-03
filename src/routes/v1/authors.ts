import { Router } from 'express';
// import jwt from 'jsonwebtoken';
// import mongoose from 'mongoose';
import {
  authorCreate,
  authorDelete,
  authorGet,
  authorUpdate,
  authorsList,
} from '../../controllers/authorsController';
import passport from 'passport';

const authorsRouter = Router();

authorsRouter.get('/:authorUrl', authorGet);

authorsRouter.put(
  '/:authorUrl',
  passport.authenticate('jwt', { session: false }),
  authorUpdate
);

authorsRouter.delete(
  '/:authorUrl',
  passport.authenticate('jwt', { session: false }),
  authorDelete
);

authorsRouter.get('/', authorsList);

authorsRouter.post('/', authorCreate);

export default authorsRouter;
