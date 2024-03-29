// import { HttpError, CreateHttpError } from 'http-errors';
import express from 'express';
import path from 'path';
import logger from 'morgan';
import 'dotenv/config';
import mongoose from 'mongoose';
import apiRouterV1 from './routes/v1/v1';
import { INext, IReq, IRes } from './types/types';
import { Author, IAuthorLogin } from './types/mongoose/Author';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import configureAuth from './middleware/configureAuth';

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

configureAuth(app);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/v1', apiRouterV1);
app.post('/api/login', async (req: IReq<IAuthorLogin>, res: IRes) => {
  const user = await Author.findOne({ username: req.body.username }).exec();
  if (!user) {
    return res.json({ error: 'Username does not exist.' });
  }
  // User supplied string first, encrypted document password second.
  const match = await bcrypt.compare(req.body.password, user.password);
  if (!match) {
    return res.json({ error: 'Password incorrect.' });
  }
  const token = jwt.sign(
    { _id: user._id, username: user.username },
    process.env.SECRET_KEY?.toString() ??
      (() => {
        throw new Error('SECRET_KEY is undefined in .env');
      })()
  );
  res.json({ token });
});
// Place a requireAuth callback before the CRUD callback
// in each router's HTTP methods

// Catch 404
app.use((req: IReq, res: IRes) => {
  console.log('app.ts 404');
  res.status(404).json({
    status: 404,
    error: 'Not Found',
    message: 'App.ts: The requested resource could not be found on the server.',
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
