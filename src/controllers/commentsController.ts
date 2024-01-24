import expressAsyncHandler from 'express-async-handler';
// this way of importing is necessary to circumvent tree shaking
import '../types/mongoose/Author';
import { Article } from '../types/mongoose/Article';
import '../types/mongoose/Comment';
import { IReq, IRes } from '../types/types';
import { Comment, IComment } from '../types/mongoose/Comment';

const asyncHandler = expressAsyncHandler;

export const commentsList = asyncHandler(async (req: IReq, res: IRes) => {
  console.log(req.params.articleUrl);

  try {
    const article = await Article.findOne({ url: req.params.articleUrl })
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

export const commentCreate = asyncHandler(
  async (req: IReq<IComment>, res: IRes) => {
    try {
      await Comment.create(req.body);
      res.json({ message: 'Comment created successfully' });
    } catch (error) {
      res.status(500).json({ error });
    }
  }
);

export const commentGet = asyncHandler(async (req: IReq, res: IRes) => {
  try {
    const comment = await Comment.findOne({ url: req.params.commentUrl })
      .populate({
        path: 'article',
        select: 'title',
      })
      .exec();

    if (comment === null) {
      res.status(404).json({ error: 'Comment document not found.' });
      return;
    }
    res.json({ comment });
  } catch (error) {
    res.status(500).json({ error });
  }
});

export const commentUpdate = asyncHandler(
  async (req: IReq<IComment>, res: IRes) => {
    const url = req.params.commentUrl;
    try {
      const comment = await Comment.updateOne({ url }, req.body);
      if (comment.matchedCount === 0) {
        throw new Error('No matching comment documents found.');
      }
      res.json({
        message: 'Comment document updated successfully.',
      });
    } catch (error) {
      res.status(500).json({ error });
    }
  }
);

export const commentDelete = asyncHandler(async (req: IReq, res: IRes) => {
  const url = req.params.commentUrl;
  try {
    const comment = await Comment.deleteOne({ url });
    if (comment.deletedCount === 0) {
      throw new Error('Comment document not found');
    }
    if (comment.acknowledged === false) {
      throw new Error('Comment document deletion failed.');
    }
    res.json({
      message: 'Comment document deleted successfully.',
    });
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
