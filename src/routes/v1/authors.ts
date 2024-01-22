import { Router } from 'express';
// import jwt from 'jsonwebtoken';
// import mongoose from 'mongoose';
import { authorsList } from '../../controllers/authorsController';

const authorsRouter = Router();

authorsRouter.get('/', authorsList);

export default authorsRouter;
