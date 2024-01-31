import expressAsyncHandler from 'express-async-handler';
import { validationResult } from 'express-validator';
import { IReq, IRes } from '../types/types';
import { ICrudArticle } from '../types/mongoose/Article';
import { ICrudAuthor } from '../types/mongoose/Author';
import { IComment, ICrudComment } from '../types/mongoose/Comment';
import { NextFunction } from 'express';

const asyncHandler = expressAsyncHandler;

type CrudTypes = ICrudArticle | ICrudAuthor | ICrudComment;

const validateBody = asyncHandler(
  async (req: IReq<CrudTypes>, res: IRes, next: NextFunction) => {
    const error = validationResult(req);

    if (!error.isEmpty()) {
      const errorArray = error.array().map((err) => err.msg);
      const errorString = errorArray.reduce(
        (accumulator, currentValue, currentIndex) =>
          accumulator + `${currentIndex + 1}. ${currentValue} `,
        ``
      );
      throw new Error(`Comment failed validation: ` + errorString.slice(0, -1));
    }
    next();
  }
);

export default validateBody;
