import bcrypt from "bcrypt";

// Hash a plain text password
export const hashPassword = (password) => {
  return bcrypt.hash(password, 5);
};

// Verify if a plain text password matches a hashed password
export const passwordMatches = async (password, userpassword) => {
  return await bcrypt.compare(password, userpassword);
};

// const logger = async (password) => {
//   const pass = await hashPassword(password);
//   console.log(pass);
// };

// // write const async format
// logger("Fadexyfrosh");
