/*Admin Routes
/admin                  // Create a new admin account
/admin/currency         // Create a new currency account
/admin/:user_id         // Check a user's account
/admin/:user_id         // Close down a user's account
*/
// A default/ super admin can make other users admins.

// Admins can close down user accounts, but would send a warning email to the user before doing so..

import client from "../config/db.js";
import { hashPassword } from "../utils/hash.js";
import { createProfileSchema, currencySchema } from "../validation/Schemas.js";
import { loginSchema } from "../validation/Schemas.js";
import { currencySchema } from "../validation/Schemas.js";
import { generateToken } from "../utils/jwt.js";
import { passwordMatches } from "../utils/hash.js";
import { sendAdminRegisterEmail } from "../utils/nodeMailer.js";
import { getCurrencyList } from "./layer.js";
import { isSupportedCurrency } from "./layer.js";

async function checkIfUserExists(email) {
  const query = `
    SELECT COUNT(*) as count
    FROM admin
    WHERE admin_email = $1
      `;
  const values = [email];
  const result = await client.query(query, values);
  return +result.rows[0].count;
}

async function checkAdminEmail(email) {
  query = `
    SELECT * 
    FROM admin
    WHERE admin_email = $1
    `;

  const values = [email];
  const result = await client.query(query, values);
  return result.rows[0];
}

async function checkIfCurrencyExists(currency_code) {
  const query = `
    SELECT COUNT(*) as count
    FROM currencies
    WHERE currency_code = 1
      `;
  const values = [currency_code];
  const result = await client.query(query, values);
  return +result.rows[0].count;
}

// An admin would create an admin account.
export async function createAdminAccount(payload) {
  const { error, value } = createProfileSchema.validate(payload);
  if (error) {
    return false;
  }
  const { first_name, last_name, email, password } = value;
  try {
    const userExists = await checkIfUserExists(email);
    if (userExists) {
      console.log("User exists");
      return "An admin with this email already exists";
    }
    const hashedPassword = await hashPassword(password);

    const query = `
        INSERT INTO admin (first_name, last_name, admin_email, admin_password) 
        VALUES ($1, $2, $3, $4) 
        RETURNING *
        `;
    const values = [first_name, last_name, email, hashedPassword];
    const result = await client.query(query, values);
    const details = result.rows[0];
    const userData = {
      first_name: details.first_name,
      last_name: details.last_name,
      admin_email: details.admin_email,
    };
    console.log(result.rows);
    const token = await generateToken(value);
    console.log("Registration Successful, user token generated");
    const response = sendAdminRegisterEmail(email);
    console.log(response);
    return { userData, token };
  } catch (error) {
    console.log(error.message);
    throw error;
  }
}

// Authenticate an admin login and generate an authentication token.
export async function adminLogin(payload) {
  const { error, value } = loginSchema.validate(payload);
  if (error) {
    return "Invalid Request";
  }
  const { email, password } = value;
  try {
    const userExists = await checkIfUserExists(email);
    if (!userExists) {
      console.log("Admin doesn't exist");
      return "Admin doesn't exist";
    }
    const query = `
        SELECT admin_password
        FROM admin
        WHERE admin_email = $1
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

// Create a new currency account
export async function createCurrency(admin_email, payload) {
  const { error, value } = currencySchema.validate(payload);
  if (error) {
    return "Invalid Request";
  }
  const { currency_code } = value;

  try {
    const adminConfirmed = await checkAdminEmail(admin_email);
    if (!adminConfirmed) {
      console.log("You are not allowed to carry this action");
      return "You are not allowed to carry this action";
    }

    const currencyExists = await checkIfCurrencyExists(currency_code);
    if (currencyExists) {
      console.log("currency exists already");
      return "currency exists already";
    }

    const { currencies } = await getCurrencyList();
    const data = await isSupportedCurrency(currency_code, currencies);
    if (!data) {
      console.log("Invalid or Unsupported currency");
      return "Invalid or Unsupported currency";
    }

    query = `
    INSERT INTO currencies(currency_code)
    VALUES ($1)
    RETURNING *
    `;

    const values = [currency_code];
    const result = await client.query(query, values);
    console.log(result.rows);
    return result.rows[0];
  } catch (error) {
    console.log(error.message);
    throw error;
  }
}

// Admins can access users with the same currency, excluding sensitive details.
export async function getUserAccountWithSameCurrency(admin_email, payload) {
  const { error, value } = currencySchema.validate(payload);
  if (error) {
    return "Invalid Request";
  }
  const { currency_code } = value;
  try {
    const adminConfirmed = await checkAdminEmail(admin_email);
    if (!adminConfirmed) {
      console.log("You are not allowed to carry this action");
      return "You are not allowed to carry this action";
    }
    query = `
    SELECT *
    FROM account
    WHERE currency_code = $1
    `;
    const values = [currency_code];
    result = client.query(query, values);
    if (!result.rows[0]) {
      console.log("No Account with specified currency available");
      return "No Account with specified currency available";
    }
    return result.rows[0];
  } catch (error) {
    console.log(error.message);
    throw error;
  }
}
