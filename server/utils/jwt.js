import jwt from "jsonwebtoken";

const generateToken = (userId) => {
  const payload = { sub: userId };

  const options = {
    expiresIn: "2d",
    issuer: "Code Academy",
  };
  // Put the secret in your .env file
  const secretOrPrivateKey = process.env.JWT_KEY;

  const token = jwt.sign(payload, secretOrPrivateKey, options);

  return token;
};

export default generateToken;
