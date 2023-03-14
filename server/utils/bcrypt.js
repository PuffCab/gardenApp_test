import bcrypt from "bcrypt";

const passwordEncryption = async (password) => {
  const saltRounds = 10;

  const salt = await bcrypt.genSalt(saltRounds);
  const hashedPassword = await bcrypt.hash(password, salt);
  console.log("hashedPassword", hashedPassword);

  return hashedPassword;
};

const verifyPassword = async (userPassword, hashedPassword) => {
  const result = await bcrypt.compare(userPassword, hashedPassword);
  console.log("bcrypt result", result);
  return result;
};

export { passwordEncryption, verifyPassword };
