import expressAsyncHandler from 'express-async-handler';
// this way of importing is necessary to circumvent tree shaking
import '../types/mongoose/Comment';
import '../types/mongoose/Author';
import { Article, IArticle } from '../types/mongoose/Article';
import { IReq, IRes } from '../types/types';

const asyncHandler = expressAsyncHandler;

export const articlesList = asyncHandler(async (req: IReq, res: IRes) => {
  const articles = await Article.find()
    .select('title author date')
    .populate({
      path: 'author',
      select: 'name',
    })
    .exec();
  if (articles.length === 0) {
    throw new Error('No matching article documents found.');
  }
  res.json({ articles });
});

export const articleCreate = asyncHandler(
  async (req: IReq<IArticle>, res: IRes) => {
    await Article.create(req.body);
    res.json({ message: 'Article created successfully' });
  }
);

export const articleGet = asyncHandler(async (req: IReq, res: IRes) => {
  const url = req.params.articleUrl;
  const article = await Article.findOne({ url })
    .populate([
      {
        path: 'comments',
        select: 'author date content url',
      },
      {
        path: 'author',
        select: 'name url',
      },
    ])
    .exec();
  if (article === null) {
    throw new Error('No matching article documents found.');
  }
  res.json({ article });
});

export const articleUpdate = asyncHandler(
  async (req: IReq<IArticle>, res: IRes) => {
    const url = req.params.articleUrl;
    const article = await Article.updateOne({ url }, req.body);
    if (article.matchedCount === 0) {
      throw new Error('No matching article documents found.');
    }
    res.json({
      message: 'Article document updated successfully.',
    });
  }
);

export const articleDelete = asyncHandler(async (req: IReq, res: IRes) => {
  const url = req.params.articleUrl;
  const article = await Article.deleteOne({ url });
  if (article.deletedCount === 0) {
    throw new Error('Article document not found');
  }
  if (article.acknowledged === false) {
    throw new Error('Article document deletion failed.');
  }
  res.json({
    message: 'Article document deleted successfully.',
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
