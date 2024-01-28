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
      //const token = jwt.sign({ sub: user._id, username: user.username }, 'your-secret-key', { expiresIn: '1h' });
      // this goes in login post. subsequent "passport.authenticate" routes will then have a jwt_payload to use.
      // passport.authenticate('jwt', {session: false})
      try {
        const user = await Author.findOne({ id: jwt_payload.sub });
        if (!user) {
          return done(null, false, { message: 'Username not found.' });
        }
        if (user) {
          done(null, user);
        } else {
          done(null, false);
        }
      } catch (error) {
        done(error, false);
      }
    })
  );

  app.use(passport.initialize());
};

export default configureAuth;
