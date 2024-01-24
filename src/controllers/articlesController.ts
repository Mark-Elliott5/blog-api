import expressAsyncHandler from 'express-async-handler';
// this way of importing is necessary to circumvent tree shaking
import '../types/mongoose/Comment';
import '../types/mongoose/Author';
import { Article, IArticle } from '../types/mongoose/Article';
import { IReq, IRes } from '../types/types';

const asyncHandler = expressAsyncHandler;

export const articlesList = asyncHandler(async (req: IReq, res: IRes) => {
  // navigate to localhost:3000/api/v1/articles
  try {
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
  } catch (error) {
    res.status(500).json({ error });
  }
});

export const articleCreate = asyncHandler(
  async (req: IReq<IArticle>, res: IRes) => {
    try {
      await Article.create(req.body);
      res.json({ message: 'Article created successfully' });
    } catch (error) {
      res.status(500).json({ error });
    }
  }
);

export const articleGet = asyncHandler(async (req: IReq, res: IRes) => {
  try {
    const article = await Article.findOne({ url: req.params.articleUrl })
      .populate({
        path: 'author',
        select: 'name',
      })
      .exec();
    if (article === null) {
      throw new Error('No matching article documents found.');
    }
    res.json({ article });
  } catch (error) {
    res.status(500).json({ error });
  }
});

export const articleUpdate = asyncHandler(
  async (req: IReq<IArticle>, res: IRes) => {
    const url = req.params.articleUrl;
    try {
      const article = await Article.updateOne({ url }, req.body);
      if (article.matchedCount === 0) {
        throw new Error('No matching article documents found.');
      }
      res.json({
        message: 'Article document updated successfully.',
      });
    } catch (error) {
      res.status(500).json({ error });
    }
  }
);

export const articleDelete = asyncHandler(async (req: IReq, res: IRes) => {
  const url = req.params.articleUrl;
  try {
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
