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

const authorsRouter = Router();

authorsRouter.get('/:authorUrl', authorGet);

authorsRouter.put('/:authorUrl', authorUpdate);

authorsRouter.delete('/:authorUrl', authorDelete);

authorsRouter.get('/', authorsList);

authorsRouter.post('/', authorCreate);

export default authorsRouter;
