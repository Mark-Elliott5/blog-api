import express from 'express';
// import jwt from 'jsonwebtoken';
import { IReq, IRes } from '../types/types';

const apiRouterV1 = express.Router();

apiRouterV1.get('/:id', (req: IReq, res: IRes) => {
  // mongoose and authentication code here
  res.json({});
});

apiRouterV1.post('/:id', (req: IReq, res: IRes) => {
  // mongoose and authentication code here
  res.json({});
});

apiRouterV1.put('/:id', (req: IReq, res: IRes) => {
  // mongoose and authentication code here
  res.json({});
});

apiRouterV1.delete('/:id', (req: IReq, res: IRes) => {
  // mongoose and authentication code here
  res.json({});
});

export default apiRouterV1;
