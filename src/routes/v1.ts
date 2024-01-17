import express from 'express';
// import jwt from 'jsonwebtoken';
import { IReq, IRes } from '../types/types';

const apiRouterV1 = express.Router();

apiRouterV1.get('/test', (req: IReq, res: IRes) => {
  // navigate to localhost:3000/api/v1/test
  res.json({ hello: 'world' });
});

apiRouterV1.get('/:id', (req: IReq, res: IRes) => {
  // mongoose and authentication code here
  res.json({});
});

apiRouterV1.post('/:id', (req: IReq, res: IRes) => {
  // mongoose and authentication code here
  res.json({});
});

apiRouterV1.put('/:id', (req: IReq, res: IRes) => {
  // const { id } = req.params;
  // mongoose and authentication code here
  res.json({});
});

apiRouterV1.delete('/:id', (req: IReq, res: IRes) => {
  // mongoose and authentication code here
  res.json({});
});

// Catch 404
apiRouterV1.use((req: IReq, res: IRes) => {
  res.status(404).json({
    status: 404,
    error: 'Not Found',
    message: 'The requested resource could not be found on the server.',
  });
});

export default apiRouterV1;
