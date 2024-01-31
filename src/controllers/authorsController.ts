import expressAsyncHandler from 'express-async-handler';
// this way of importing is necessary to circumvent tree shaking
import '../types/mongoose/Comment';
import '../types/mongoose/Article';
import { Author, IAuthor, ICrudAuthor } from '../types/mongoose/Author';
import { IReq, IRes } from '../types/types';
import slugify from 'slugify';
import { nanoid } from 'nanoid';
import bcrypt from 'bcrypt';
import { Types } from 'mongoose';

const asyncHandler = expressAsyncHandler;

export const authorsList = asyncHandler(async (req: IReq, res: IRes) => {
  const authors = await Author.find()
    .populate({ path: 'articles', select: 'title date' })
    .exec();
  if (authors.length === 0) {
    throw new Error('No matching author documents found.');
  }
  res.json({ authors });
});

export const authorCreate = asyncHandler(
  async (req: IReq<ICrudAuthor>, res: IRes) => {
    if (!req.user) {
      throw new Error('User not logged in.');
    }
    const existingAuthor = await Author.findOne({
      username: req.body.username,
    }).exec();
    if (existingAuthor) {
      throw new Error('Author username already exists.');
    }
    const slug = slugify(req.body.name, {
      lower: false,
      trim: true,
    });
    const nano = nanoid(10);
    const url = `${nano}-${slug}`;
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const newAuthor: IAuthor = {
      name: req.body.name,
      articles: new Types.Array(),
      url,
      username: req.body.username,
      password: hashedPassword,
    };
    await Author.create(newAuthor);
    res.json({ message: 'Author created successfully' });
  }
);

export const authorGet = asyncHandler(async (req: IReq, res: IRes) => {
  const url = req.params.authorUrl;
  const author = await Author.findOne({ url })
    .select('name articles url')
    .populate({
      path: 'articles',
      select: 'title date',
    })
    .exec();
  if (!author) {
    throw new Error('Author not found.');
  }
  res.json({ author });
});

export const authorUpdate = asyncHandler(
  async (req: IReq<ICrudAuthor>, res: IRes) => {
    if (!req.user) {
      throw new Error('User not logged in.');
    }
    const url = req.params.authorUrl;
    const author = await Author.findOne({ url }).exec();
    if (!author) {
      throw new Error('No matching author documents found.');
    }
    const newAuthor = {
      name: req.body.name,
      username: req.body.username,
      password: req.body.password,
      url: author.url,
    };
    if (author.name !== req.body.name) {
      const slug = slugify(req.body.name, {
        lower: false,
        trim: true,
      });
      const nano = nanoid(10);
      newAuthor.url = `${nano}-${slug}`;
    }
    await author
      .updateOne({
        $set: newAuthor,
      })
      .exec();
    res.json({
      message: 'Author document updated successfully.',
    });
  }
);

export const authorDelete = asyncHandler(async (req: IReq, res: IRes) => {
  if (!req.user) {
    throw new Error('User not logged in.');
  }
  const url = req.params.authorUrl;
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
