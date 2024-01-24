import { Router } from 'express';
import expressAsyncHandler from 'express-async-handler';
// this way of importing is necessary to circumvent tree shaking
// import '../../types/mongoose/Comment';
// import '../../types/mongoose/Author';
// import jwt from 'jsonwebtoken';
// import mongoose from 'mongoose';
import { IReq, IRes } from '../../types/types';
import articlesRouter from './articles';
import authorsRouter from './authors';

const apiRouterV1 = Router();

apiRouterV1.use('/articles', articlesRouter);
apiRouterV1.use('/authors', authorsRouter);

// Catch 404
apiRouterV1.use((req: IReq, res: IRes) => {
  console.log('v1.ts 404');
  res.status(404).json({
    status: 404,
    error: 'Not Found',
    message: 'The requested resource could not be found on the server.',
  });
});

export default apiRouterV1;
