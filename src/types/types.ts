import { Request, Response, NextFunction } from 'express';
import { Types } from 'mongoose';

declare global {
  namespace Express {
    interface User {
      _id: Types.ObjectId;
      username: string;
    }
  }
}

export interface IReq<T = void> extends Request {
  body: T;
}

export interface IRes extends Response {}

export interface INext extends NextFunction {}

// declare namespace Express {
//   interface User {
//     id: string;
//     username: string;
//   }
// }

// declare global {
//   namespace Express {
//     export interface Request {
//       user: PassportUser;
//     }
//   }
// }

// declare namespace Express {
//   interface User {
//     user?: PassportUser;
//   }
// }

// interface PassportUser {
//   id: string;
//   username: string;
// }

// export interface IAuthReq<T = void, I> extends Request {
//   user: PassportUser;
//   body: T;
// }
