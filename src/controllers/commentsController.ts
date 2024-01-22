import expressAsyncHandler from 'express-async-handler';
// this way of importing is necessary to circumvent tree shaking
import '../types/mongoose/Author';
import Article from '../types/mongoose/Article';
import '../types/mongoose/Comment';
import { IReq, IRes } from '../types/types';

const asyncHandler = expressAsyncHandler;

export const commentsList = asyncHandler(async (req: IReq, res: IRes) => {
  console.log(req.params.articleTitle);

  const article = await Article.find({ url: req.params.articleTitle })
    .populate({
      path: 'author',
      select: 'name',
    })
    .exec();
  res.json({ article });
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
