import { transferToAccount } from "../models/tranfers.js";
import { getTransfer } from "../models/tranfers.js";
import { getTransfersOnAccount } from "../models/tranfers.js";

export async function transferToAnAccount(req, res) {
  try {
    const user_email = req.user_email;
    const data = await transferToAccount(user_email, req.body);
    if (!data) {
      return res.status(400).json({ error: "Error Invalid Request" });
    }
    if (data === "Invalid Request") {
      return res.status(400).json({ error: "Error Invalid Request" });
    }
    if (data === "Insufficient funds") {
      return res.status(400).json({ error: "Insufficient funds" });
    }
    if (data === "No user with the provided account number exists") {
      return res
        .status(400)
        .json({ error: "No user with the provided account number exists" });
    }

    return res.status(201).json({
      message: "Transfer successful",
      transfer_details: data,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
}

export async function getADeposit(req, res) {
  try {
    const user_email = req.user_email;
    const data = await getDeposit(user_email, req.body);
    if (data === "Invalid Request") {
      return res.status(400).json({ error: "Error Invalid Request" });
    }
    if (!data) {
      return res.status(400).json({ error: "No deposit found" });
    }
    return res.status(201).json({
      message: "Deposit details",
      details: data,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
}

export async function getDepositsOnAnAccount(req, res) {
  try {
    const user_email = req.user_email;
    const data = await getDepositsOnAccount(user_email, req.body);
    if (data === "Invalid Request") {
      return res.status(400).json({ error: "Error Invalid Request" });
    }
    if (!data) {
      return res.status(400).json({ error: "No deposit found" });
    }
    return res.status(201).json({
      message: "Deposit details",
      details: data,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
}
