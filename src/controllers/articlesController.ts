import expressAsyncHandler from 'express-async-handler';
// this way of importing is necessary to circumvent tree shaking
import '../types/mongoose/Comment';
import '../types/mongoose/Author';
import { Article, IArticle, ICreateArticle } from '../types/mongoose/Article';
import { IReq, IRes } from '../types/types';
import { Author } from '../types/mongoose/Author';
import { nanoid } from 'nanoid';
import slugify from 'slugify';

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
  async (req: IReq<ICreateArticle>, res: IRes) => {
    console.log('create article');
    if (req.user) {
      // if req.user._id is a string, we must use id instead of _id to query.
      // because id casts to string.
      const author = await Author.findOne({ _id: req.user._id }).exec();
      if (author) {
        const slug = slugify(req.body.title, {
          remove: /[^\w\s-]/g,
          lower: true,
          trim: true,
        });
        const nano = nanoid(10);
        const url = `${slug}-${nano}`;
        const articleParams: IArticle = {
          title: req.body.title,
          author: author._id,
          date: new Date(),
          content: req.body.content,
          comments: [],
          url,
        };
        const article = await Article.create(articleParams);
        author.articles.push(article);
        await author.save();
        res.json({ message: 'Article created successfully' });
      } else {
        throw new Error('Author not found.');
      }
    } else {
      throw new Error('User not found.');
    }
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
