import { Request, Response, NextFunction } from 'express';

export interface IReq<T = void> extends Request {
  body: T;
}

export interface IRes extends Response {}

export interface INext extends NextFunction {}

// export interface MiddlewareParams {
//   req: MiddlewareReq;
//   res: MiddlewareRes;
//   next: void;
// }