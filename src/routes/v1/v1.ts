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

// apiRouterV1.get('/test', (req: IReq, res: IRes) => {
//   // navigate to localhost:3000/api/v1/test
//   res.json({ hello: 'world' });
// });

// apiRouterV1.get(
//   '/articles',
//   asyncHandler(async (req: IReq, res: IRes) => {
//     // navigate to localhost:3000/api/v1/articles
//     // await Comment;
//     const articles = await Article.find()
//       .populate([
//         {
//           path: 'comments',
//         },
//         {
//           path: 'author',
//           select: 'name',
//         },
//       ])
//       .exec();
//     res.json({ articles });
//   })
// );

// apiRouterV1.get(
//   '/authors',
//   asyncHandler(async (req: IReq, res: IRes) => {
//     // navigate to localhost:3000/api/v1/articles
//     const authors = await Author.find().populate('articles').exec();
//     res.json({ authors });
//   })
// );

// apiRouterV1.get('/:id', (req: IReq, res: IRes) => {
//   // mongoose and authentication code here
//   res.json({});
// });

// apiRouterV1.post('/:id', (req: IReq, res: IRes) => {
//   // mongoose and authentication code here
//   res.json({});
// });

// apiRouterV1.put('/:id', (req: IReq, res: IRes) => {
//   // const { id } = req.params;
//   // mongoose and authentication code here
//   res.json({});
// });

// apiRouterV1.delete('/:id', (req: IReq, res: IRes) => {
//   // mongoose and authentication code here
//   res.json({});
// });

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
