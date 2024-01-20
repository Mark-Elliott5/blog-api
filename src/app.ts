// import { HttpError, CreateHttpError } from 'http-errors';
import express from 'express';
import path from 'path';
import logger from 'morgan';
import 'dotenv/config';
import mongoose from 'mongoose';
import apiRouterV1 from './routes/v1';
import { INext, IReq, IRes } from './types/types';

const app = express();
mongoose.set('strictQuery', true);

const mongoDBURI: string = process.env.MONGODB_URI ?? '';

async function connectToDB() {
  console.log(mongoDBURI);
  await mongoose.connect(mongoDBURI);
}
connectToDB().catch((err) => console.log(`Database connection error: ${err}`));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/v1', apiRouterV1);

// Catch 404
app.use((req: IReq, res: IRes) => {
  res.status(404).json({
    status: 404,
    error: 'Not Found',
    message: 'The requested resource could not be found on the server.',
  });
});

// error handler
// needs 4 args to register as error handler
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: Error, req: IReq, res: IRes, next: INext): void => {
  // set locals, only providing error in development
  console.log('Error caught');
  console.log(err);

  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(500).json({ error: err });
});

export default app;
