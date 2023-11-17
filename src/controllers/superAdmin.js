import { superAdminLogin } from "../models/superAdmin.js";
import { sendAdminToken } from "../models/superAdmin.js";

export async function logSuperAdmin(req, res) {
  try {
    const data = await superAdminLogin(req.body);

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

export async function sendAnAdminToken(req, res) {
  try {
    const admin_email = req.user_email;
    const data = await sendAdminToken(admin_email, req.body);
    if (!data) {
      return res.status(400).json({ error: "Invalid Request" });
    }
    if (data === "Admin does not exist") {
      return res
        .status(400)
        .json({ error: "You are not allowed to carry out this action" });
    }
    return res.status(201).json({
      message: "ADMIN REGISTER LINK HAS BEEN SENT",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
}
