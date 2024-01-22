import expressAsyncHandler from 'express-async-handler';
// this way of importing is necessary to circumvent tree shaking
import '../types/mongoose/Comment';
import '../types/mongoose/Author';
import Article from '../types/mongoose/Article';
import { IReq, IRes } from '../types/types';

const asyncHandler = expressAsyncHandler;

export const articlesList = asyncHandler(async (req: IReq, res: IRes) => {
  // navigate to localhost:3000/api/v1/articles
  const articles = await Article.find()
    .select('title author date')
    .populate({
      path: 'author',
      select: 'name',
    })
    .exec();
  console.log(typeof articles[0].date);
  res.json({ articles });
});

export const articleGet = asyncHandler(async (req: IReq, res: IRes) => {
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
