import expressAsyncHandler from 'express-async-handler';
// this way of importing is necessary to circumvent tree shaking
import '../types/mongoose/Comment';
import '../types/mongoose/Article';
import Author from '../types/mongoose/Author';
import { IReq, IRes } from '../types/types';

const asyncHandler = expressAsyncHandler;

export const authorsList = asyncHandler(async (req: IReq, res: IRes) => {
  // navigate to localhost:3000/api/v1/articles
  const authors = await Author.find()
    .populate({ path: 'articles', select: 'title date' })
    .exec();
  res.json({ authors });
});

// .populate([
//   {
//     path: 'comments',
//   },
//   {
//     path: 'author',
//     select: 'name',
//   },
// ])

export const test = 0;