import { createUserProfile } from "../models/userAuth.js";
import { userLogin } from "../models/userAuth.js";
import { sendResetLink } from "../models/userAuth.js";
import { reset } from "../models/userAuth.js";

// Create a user profile
export async function createAUserProfile(req, res) {
  try {
    const data = await createUserProfile(req.body);
    const { userData, token } = data;
    if (data === "User exists") {
      return res
        .status(400)
        .json({ error: "An account with this email exists already" });
    }
    if (!data) {
      return res.status(400).json({ error: "Invalid Request" });
    }
    res.cookie("token", token);
    return res.status(201).json({
      message: "REGISTRATION SUCESSFULL",
      Your_Details: userData,
      token: token,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
}

// Log in a user
export async function logUser(req, res) {
  try {
    const data = await userLogin(req.body);

    if (data === "Invalid Request") {
      return res.status(400).json({ error: "Invalid Request" });
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

// Send a password reset link
export async function sendAResetLink(req, res) {
  try {
    const data = await sendResetLink(req.body);

    if (data === "Invalid Request") {
      return res.status(400).json({ error: "Invalid Request" });
    }

    if (!data) {
      return res.status(400).json({ error: "User with email doesn't exist" });
      console.log("------------");
    }
    return res.status(201).json({
      message: "YOUR RESET LINK HAS BEEN SENT TO YOUR EMAIL",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
}

// Reset the user's password
export async function resetPassword(req, res) {
  try {
    const { email } = await req.user;
    const data = await reset(email, req.body);
    if (!data) {
      return res.status(400).json({ error: "Passwords don't match" });
    }
    if (data === "Unable to Update Database") {
      return res
        .status(500)
        .json({ message: "Internal Server Error", error: error.message });
    }
    return res.status(201).json({
      message: "PASSWORD HAS BEEN UPDATED SUCCESSFULLY",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
}
