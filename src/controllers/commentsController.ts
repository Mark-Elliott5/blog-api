import expressAsyncHandler from 'express-async-handler';
// this way of importing is necessary to circumvent tree shaking
import '../types/mongoose/Author';
import { Article } from '../types/mongoose/Article';
import '../types/mongoose/Comment';
import { IReq, IRes } from '../types/types';

const asyncHandler = expressAsyncHandler;

export const commentsList = asyncHandler(async (req: IReq, res: IRes) => {
  console.log(req.params.articleTitle);

  try {
    const article = await Article.findOne({ url: req.params.articleTitle })
      .populate('comments')
      .exec();

    if (article === null) {
      res.status(404).json({ error: 'Parent article document not found.' });
      return;
    }
    const { comments } = article;
    res.json({ comments });
  } catch (error) {
    res.status(500).json({ error });
  }
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
