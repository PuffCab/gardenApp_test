import { ExtractJwt, Strategy as JwtStrategy } from "passport-jwt";
import userModel from "../model/userModel.js";
import dotenv from "dotenv";
dotenv.config();

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_KEY,
};

const jwtStrategy = new JwtStrategy(options, function (jwt_payload, done) {
  userModel.findOne({ _id: jwt_payload.sub }, function (err, user) {
    if (err) {
      return done(err, false);
    }
    if (user) {
      return done(null, user);
    }
  });
});

export default jwtStrategy;
