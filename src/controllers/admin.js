import { createAdminAccount } from "../models/admin.js";
import { adminLogin } from "../models/admin.js";
import { createCurrency } from "../models/admin.js";
import { getUserAccountWithSameCurrency } from "../models/admin.js";
import { getUserAccount } from "../models/admin.js";

//Create admin Account
export async function createAnAdminAccount(req, res) {
  try {
    const data = await createAdminAccount(req.body);
    const { userData, newToken } = data;
    if (data === "An admin with this email already exists") {
      return res
        .status(400)
        .json({ error: "An admin with this email already exists" });
    }
    if (!data) {
      return res.status(400).json({ error: "Invalid Request" });
    }
    if (data === "Invalid token") {
      return res.status(401).json({ error: "Invalid token" });
    }
    res.cookie("token", token);
    return res.status(201).json({
      message: "ADMIN REGISTRATION SUCESSFULL",
      Your_Details: userData,
      token: newToken,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
}

// Log in an admin user and set a cookie with the user's token
export async function logAdmin(req, res) {
  try {
    const data = await adminLogin(req.body);

    if (data === "Invalid Request") {
      return res.status(400).json({ error: "Invalid Request" });
    }
    if (data === "Admin doesn't exist") {
      return res.status(400).json({ error: "Invalid Email/ Password" });
    }
    if (!data) {
      return res.status(400).json({ error: "Invalid Email/ Password" });
    }

    res.cookie("token", data, { httpOnly: true });
    return res.status(201).json({
      message: "LOGIN SUCESSFUL",
      token: data,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
}

// Create a new currency with specific user details
export async function createACurrency(req, res) {
  try {
    const user_email = req.user_email;
    const data = await createCurrency(user_email, req.body);

    if (data === "Invalid Request") {
      return res.status(400).json({ error: "Invalid Request" });
    }
    if (data === "You are not allowed to carry this action") {
      return res
        .status(400)
        .json({ error: "You are not allowed to carry this action" });
    }
    if (data === "currency exists already") {
      return res.status(400).json({ error: "Currency exists already" });
    }
    if (data === "Invalid or Unsupported currency") {
      return res.status(400).json({ error: "Invalid or Unsupported currency" });
    }

    return res.status(201).json({
      message: "CURRENCY CREATED SUCESSFULLY",
      details: data,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
}

// Retrieve user accounts with the same currency as the user's
export async function getTheUserAccountsWithSameCurrency(req, res) {
  try {
    const user_email = req.user_email;
    const data = await getUserAccountWithSameCurrency(user_email, req.body);

    if (data === "Invalid Request") {
      return res.status(400).json({ error: "Invalid Request" });
    }
    if (data === "You are not allowed to carry this action") {
      return res
        .status(400)
        .json({ error: "You are not allowed to carry this action" });
    }
    if (data === "No Account with specified currency available") {
      return res
        .status(400)
        .json({ error: "No Account with specified currency available" });
    }

    return res.status(201).json({
      message: "ACCOUNTS",
      details: data,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
}

// Get details of a specific user's account based on account number
export async function getAUser(req, res) {
  try {
    const user_email = req.user_email;
    const data = await getUserAccount(user_email, req.body);

    if (data === "Invalid Request") {
      return res.status(400).json({ error: "Invalid Request" });
    }
    if (data === "You are not allowed to carry this action") {
      return res
        .status(400)
        .json({ error: "You are not allowed to carry this action" });
    }
    if (data === "No Account with account number available") {
      return res
        .status(400)
        .json({ error: "No Account with account number available" });
    }

    return res.status(201).json({
      message: "ACCOUNT",
      details: data,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
}
