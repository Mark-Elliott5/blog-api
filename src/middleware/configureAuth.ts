import { JwtPayload } from 'jsonwebtoken';
import { Application } from 'express';
import passport from 'passport';
import {
  Strategy as JwtStrategy,
  ExtractJwt,
  StrategyOptionsWithoutRequest,
} from 'passport-jwt';
import 'dotenv/config';
import { Author } from '../types/mongoose/Author';

const configureAuth = (app: Application) => {
  const opts: StrategyOptionsWithoutRequest = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey:
      process.env.SECRET_KEY?.toString() ??
      (() => {
        throw new Error('SECRET_KEY is undefined in .env');
      })(),
    // issuer: 'accounts.examplesoft.com',
    // audience: 'yoursite.net',
  };

  passport.use(
    new JwtStrategy(opts, async (jwt_payload: JwtPayload, done) => {
      // const token = jwt.sign({ sub: user._id, username: user.username }, 'your-secret-key', { expiresIn: '1h' });
      // or const token = jwt.sign({ _id: user._id, username: user.username }, 'your-secret-key', { expiresIn: '1h' });
      // this goes in login post. subsequent "passport.authenticate" routes will then have a jwt_payload to use.
      // passport.authenticate('jwt', {session: false})

      // in Mongoose 7.4+, id and _id are the same. However, if you assign
      // jwt_payload.sub to user._id, you will need to query with id not
      // _id. This is because sub is string type, and querying with id will pull
      // _id as a string instead of ObjectId. In simpler words "id" is a virtual
      // getter that returns _id ObjectId as a string.
      try {
        const user = await Author.findOne({ _id: jwt_payload._id }).exec();
        if (!user) {
          return done(null, false, { message: 'Username not found.' });
        }
        const userObj: Express.User = {
          _id: user._id,
          username: user.username,
        };
        return done(null, userObj);
      } catch (error) {
        return done(error, false);
      }
    })
  );

  app.use(passport.initialize());
};

export default configureAuth;
