import expressAsyncHandler from 'express-async-handler';
// this way of importing is necessary to circumvent tree shaking
// import '../types/mongoose/Author';
import { Article } from '../types/mongoose/Article';
import '../types/mongoose/Comment';
import { IReq, IRes } from '../types/types';
import { Comment, IComment, ICrudComment } from '../types/mongoose/Comment';
import { nanoid } from 'nanoid';

const asyncHandler = expressAsyncHandler;

export const commentsList = asyncHandler(async (req: IReq, res: IRes) => {
  const url = req.params.articleUrl;
  const article = await Article.findOne({ url }).populate('comments').exec();

  if (!article) {
    throw new Error('Article not found.');
  }
  const { comments } = article;
  res.json({ comments });
});

export const commentCreate = asyncHandler(
  async (req: IReq<ICrudComment>, res: IRes) => {
    const article = await Article.findOne({
      url: req.params.articleUrl,
    }).exec();
    if (!article) {
      throw new Error('Article not found.');
    }
    const commentData: IComment = {
      author: req.body.author,
      date: new Date(),
      content: req.body.content,
      article: article._id,
      url: nanoid(10),
    };
    const comment = await Comment.create(commentData);
    await article.updateOne({ $push: { comments: comment._id } }).exec();
    res.json({ message: 'Comment created successfully' });
  }
);

export const commentGet = asyncHandler(async (req: IReq, res: IRes) => {
  const url = req.params.commentUrl;
  const comment = await Comment.findOne({ url })
    .populate({
      path: 'article',
      select: 'title',
    })
    .exec();
  if (!comment) {
    throw new Error('Comment not found.');
  }
  res.json({ comment });
});

export const commentUpdate = asyncHandler(
  async (req: IReq<IComment>, res: IRes) => {
    const url = req.params.commentUrl;
    const comment = await Comment.updateOne({ url }, req.body).exec();
    if (comment.matchedCount === 0) {
      throw new Error('No matching comment documents found.');
    }
    res.json({
      message: 'Comment document updated successfully.',
    });
  }
);

export const commentDelete = asyncHandler(async (req: IReq, res: IRes) => {
  const url = req.params.commentUrl;
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
