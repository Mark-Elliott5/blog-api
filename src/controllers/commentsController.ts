import expressAsyncHandler from 'express-async-handler';
// this way of importing is necessary to circumvent tree shaking
// import '../types/mongoose/Author';
import { Article } from '../types/mongoose/Article';
import '../types/mongoose/Comment';
import { IReq, IRes } from '../types/types';
import { Comment, IComment, ICrudComment } from '../types/mongoose/Comment';
import { nanoid } from 'nanoid';
import { body } from 'express-validator';
import validateBody from '../middleware/validateBody';

const asyncHandler = expressAsyncHandler;

export const commentValidationFunctions = [
  body('author')
    .exists()
    .withMessage('Author field required.')
    .notEmpty()
    .withMessage('Author field must not be empty.')
    .not()
    .contains(/\s/)
    .withMessage('Author field must not contain whitespace characters.')
    .trim()
    .matches(/^[a-zA-Z0-9\-._]+$/)
    .withMessage(
      'Author field must only contain alphanumeric characters, periods, underscores, and/or hyphens.'
    )
    .isLength({ min: 4, max: 32 })
    .withMessage('Author field must be 4-32 characters in length.')
    .escape(),
  body('content')
    .exists()
    .withMessage('Content field required.')
    .notEmpty()
    .withMessage('Content field must not be empty.')
    .isLength({ min: 1, max: 2048 })
    .withMessage('Content field must be 1-2048 characters in length.')
    .escape(),
];

export const commentsList = asyncHandler(async (req: IReq, res: IRes) => {
  const url = req.params.articleUrl;
  const article = await Article.findOne({ url }).populate('comments').exec();

  if (!article) {
    throw new Error('Article not found.');
  }
  const { comments } = article;
  res.json({ comments });
});

export const commentCreate = [
  ...commentValidationFunctions,

  validateBody,

  asyncHandler(async (req: IReq<ICrudComment>, res: IRes) => {
    const url = req.params.articleUrl;
    const article = await Article.findOne({ url }).exec();
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
    res.json({ message: 'Comment created successfully.' });
  }),
];

export const commentGet = asyncHandler(async (req: IReq, res: IRes) => {
  const commentUrl = req.params.commentUrl;
  const articleUrl = req.params.articleUrl;
  const article = await Article.findOne({ url: articleUrl }).exec();
  if (!article) {
    throw new Error('Article not found for supplied comment.');
  }
  const comment = await Comment.findOne({
    url: commentUrl,
    article: article._id,
  })
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

export const commentUpdate = [
  ...commentValidationFunctions,

  validateBody,

  asyncHandler(async (req: IReq<ICrudComment>, res: IRes) => {
    const url = req.params.commentUrl;
    const articleUrl = req.params.articleUrl;
    const article = await Article.findOne({ url: articleUrl }).exec();
    if (!article) {
      throw new Error('Article not found for supplied comment.');
    }
    const comment = await Comment.updateOne(
      { url, article: article._id },
      req.body
    ).exec();
    if (comment.matchedCount === 0) {
      throw new Error('No matching comments found.');
    }
    res.json({
      message: 'Comment updated successfully.',
    });
  }),
];

export const commentDelete = asyncHandler(async (req: IReq, res: IRes) => {
  const commentUrl = req.params.commentUrl;
  const articleUrl = req.params.articleUrl;
  const article = await Article.findOne({ url: articleUrl }).exec();
  if (!article) {
    throw new Error('Article not found for supplied comment.');
  }
  const comment = await Comment.deleteOne({ url: commentUrl });
  if (comment.deletedCount === 0) {
    throw new Error('Comment not found.');
  }
  if (comment.acknowledged === false) {
    throw new Error('Comment deletion failed.');
  }
  res.json({
    message: 'Comment deleted successfully.',
  });
});
