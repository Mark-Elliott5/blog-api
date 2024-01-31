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
import { body } from 'express-validator';
import validateBody from '../middleware/validateBody';

const asyncHandler = expressAsyncHandler;

export const authorValidationFunctions = [
  body('name')
    .exists()
    .withMessage('Name field required.')
    .notEmpty()
    .withMessage('Name field required.')
    .trim()
    .matches(/[^\w\s]|[\d]/)
    .withMessage(
      'Name field must only contain alphanumeric characters or underscores.'
    )
    .isLength({ min: 4, max: 40 })
    .withMessage('Name field must be 4-32 characters in length.')
    .escape(),
  body('username')
    .exists()
    .notEmpty()
    .withMessage('Username field must not be empty.')
    .isString()
    .withMessage('Username field must be a string')
    .not()
    .contains(/\s/)
    .withMessage('Username field must not contain whitespace characters.')
    .trim()
    .matches(/^[a-zA-Z0-9\-._]+$/)
    .withMessage(
      'Username field must only contain alphanumeric characters, periods, underscores, and/or hyphens.'
    )
    .isLength({ min: 4, max: 32 })
    .withMessage('Username field must be 4-32 characters in length.')
    .escape(),
  body('password')
    .exists()
    .notEmpty()
    .withMessage('Password field must not be empty.')
    .isString()
    .withMessage('Password field must be a string')
    .not()
    .contains(/\s/)
    .withMessage('Password field must not contain whitespace characters.')
    .trim()
    .matches(/^[a-zA-Z0-9\-._]+$/)
    .withMessage(
      'Password field must only contain alphanumeric characters, periods, underscores, and/or hyphens.'
    )
    .isLength({ min: 8, max: 128 })
    .withMessage('Password field must be 8-128 characters in length.')
    .escape(),
];

export const authorsList = asyncHandler(async (req: IReq, res: IRes) => {
  const authors = await Author.find()
    .populate({ path: 'articles', select: 'title date' })
    .exec();
  if (authors.length === 0) {
    throw new Error('No matching authors found.');
  }
  res.json({ authors });
});

export const authorCreate = [
  ...authorValidationFunctions,

  validateBody,

  asyncHandler(async (req: IReq<ICrudAuthor>, res: IRes) => {
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
  }),
];

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

export const authorUpdate = [
  ...authorValidationFunctions,

  validateBody,

  asyncHandler(async (req: IReq<ICrudAuthor>, res: IRes) => {
    if (!req.user) {
      throw new Error('User not logged in.');
    }
    const url = req.params.authorUrl;
    const author = await Author.findOne({ url }).exec();
    if (!author) {
      throw new Error('No matching authors found.');
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
      message: 'Author updated successfully.',
    });
  }),
];

export const authorDelete = asyncHandler(async (req: IReq, res: IRes) => {
  if (!req.user) {
    throw new Error('User not logged in.');
  }
  const url = req.params.authorUrl;
  const author = await Author.deleteOne({ url });
  if (author.deletedCount === 0) {
    throw new Error('Author not found');
  }
  if (author.acknowledged === false) {
    throw new Error('Author deletion failed.');
  }
  res.json({
    message: 'Author deleted successfully.',
  });
});
