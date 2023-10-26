// Authentication Routes
// /auth/users             // Users create a profile
// /auth/users/login       // Login
// /auth/users/forgot-password // Forgot password
// /auth/users/reset-password/:token // Reset password

import client from "../config/db.js";
import { hashPassword } from "../utils/hash.js";
import { passwordMatches } from "../utils/hash.js";
import { generateToken } from "../utils/jwt.js";
import { createProfileSchema } from "../validation/Schemas.js";
import { loginSchema } from "../validation/Schemas.js";
import { resetSchema } from "../validation/Schemas.js";
import { sendEmail } from "../utils/nodeMailer.js";
import { sendRegisterEmail } from "../utils/nodeMailer.js";

async function checkIfUserExists(email) {
  const query = `
  SELECT COUNT(*) as count
  FROM users
  WHERE user_email = $1
    `;
  const values = [email];
  const result = await client.query(query, values);
  return +result.rows[0].count;
}

//Create an account
export async function createUserProfile(payload) {
  const { error, value } = createProfileSchema.validate(payload);
  if (error) {
    return false;
  }
  const { first_name, last_name, email, password } = value;
  try {
    const userExists = await checkIfUserExists(email);
    if (userExists) {
      console.log("User exists");
      return "User exists";
    }
    const hashedPassword = await hashPassword(password);

    const query = `
      INSERT INTO users (first_name, last_name, user_email, password) 
      VALUES ($1, $2, $3, $4) 
      RETURNING *
      `;
    const values = [first_name, last_name, email, hashedPassword];
    const result = await client.query(query, values);
    const details = result.rows[0];
    const userData = {
      first_name: details.first_name,
      last_name: details.last_name,
      user_email: details.user_email,
    };
    console.log(result.rows);
    const token = await generateToken(value);
    console.log("Registration Successful, user token generated");
    const response = sendRegisterEmail(email);
    console.log(response);
    return { userData, token };
  } catch (error) {
    console.log(error.message);
    throw error;
  }
}

export async function userLogin(payload) {
  const { error, value } = loginSchema.validate(payload);
  if (error) {
    return "Invalid Request";
  }
  const { email, password } = value;
  try {
    const userExists = await checkIfUserExists(email);
    if (!userExists) {
      console.log("User doesn't exist");
      return "User doesn't exist";
    }
    const query = `
      SELECT password
      FROM users
      WHERE user_email = $1
      `;
    const values = [email];
    const result = await client.query(query, values);
    const dbPassword = result.rows[0].password;
    const isMatch = await passwordMatches(password, dbPassword);
    if (!isMatch) {
      console.log("passwords don't match");
      return false;
    }
    const token = await generateToken(value);
    console.log("Login Successful, user token generated");
    console.log(token);
    return token;
  } catch (error) {
    console.log(error.message);
    throw error;
  }
}

export const sendResetLink = async (payload) => {
  const { error, value } = resetSchema.validate(payload);
  if (error) {
    return "Invalid Request";
  }
  console.log("------------");
  const { email } = value;

  const userExists = await checkIfUserExists(email);
  if (!userExists) {
    console.log("User doesn't exist");
    return false;
  }
  try {
    const token = await generateToken(value);
    console.log("------------");
    const response = sendEmail(email, token);
    return { response };
  } catch (error) {
    console.error(error);
    return error;
  }
};

export async function reset(email, userPassword) {
  const { password, confirm_password } = userPassword;
  if (password !== confirm_password) {
    console.log("Passwords don't match");
    return false;
  }
  const hashedPassword = await hashPassword(confirm_password);
  console.log(hashedPassword);
  try {
    const query0 = `
      UPDATE users
      SET password = $1
      WHERE user_email = $2
      RETURNING *
    `;
    const values0 = [hashedPassword, email];
    const result = await client.query(query0, values0);
    console.log(result.rowCount);
    if (result.rowCount === 0) {
      return "Unable to Update Database";
    }
    console.log(result.rows[0]);
    return result.rows;
  } catch (err) {
    console.error(err.message);
    throw err;
  }
}
