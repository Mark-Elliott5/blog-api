import expressAsyncHandler from 'express-async-handler';
// this way of importing is necessary to circumvent tree shaking
import '../types/mongoose/Comment';
import '../types/mongoose/Article';
import { Author, IAuthor } from '../types/mongoose/Author';
import { IReq, IRes } from '../types/types';

const asyncHandler = expressAsyncHandler;

export const authorsList = asyncHandler(async (req: IReq, res: IRes) => {
  // navigate to localhost:3000/api/v1/articles
  try {
    const authors = await Author.find()
      .populate({ path: 'articles', select: 'title date' })
      .exec();
    if (authors.length === 0) {
      throw new Error('No matching author documents found.');
    }
    res.json({ authors });
  } catch (error) {
    res.status(500).json({ error });
  }
});

export const authorCreate = asyncHandler(
  async (req: IReq<IAuthor>, res: IRes) => {
    try {
      await Author.create(req.body);
      res.json({ message: 'Author created successfully' });
    } catch (error) {
      res.status(500).json({ error });
    }
  }
);

export const authorGet = asyncHandler(async (req: IReq, res: IRes) => {
  const url = req.params.authorUrl;
  try {
    const author = await Author.findOne({ url })
      .populate({
        path: 'articles',
        select: 'title date',
      })
      .exec();

    if (author === null) {
      res.status(404).json({ error: 'Author document not found.' });
      return;
    }
    res.json({ author });
  } catch (error) {
    res.status(500).json({ error });
  }
});

export const authorUpdate = asyncHandler(
  async (req: IReq<IAuthor>, res: IRes) => {
    const url = req.params.authorUrl;
    try {
      const author = await Author.updateOne({ url }, req.body);
      if (author.matchedCount === 0) {
        throw new Error('No matching author documents found.');
      }
      res.json({
        message: 'Author document updated successfully.',
      });
    } catch (error) {
      res.status(500).json({ error });
    }
  }
);

export const authorDelete = asyncHandler(async (req: IReq, res: IRes) => {
  const url = req.params.authorUrl;
  try {
    const author = await Author.deleteOne({ url });
    if (author.deletedCount === 0) {
      throw new Error('Author document not found');
    }
    if (author.acknowledged === false) {
      throw new Error('Author document deletion failed.');
    }
    res.json({
      message: 'Author document deleted successfully.',
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

export const test = 0;
