import { withdraw } from "../models/withdrawals";
import { getWithdrawal } from "../models/withdrawals";
import { getWithdrawalsOnAccount } from "../models/withdrawals";

export async function withdrawCash(req, res) {
  try {
    const user_email = req.user_email;
    const data = await withdraw(user_email, req.body);
    if (!data) {
      return res.status(400).json({ error: "Error Invalid Request" });
    }
    if (data === "You are not allowed to carry out this action") {
      return res
        .status(400)
        .json({ error: "You are not allowed to carry out this action" });
    }
    return res.status(201).json({
      message: "Withdrawal successful",
      withdrawal_details: data.resulting,
      balance: data.now_balance,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
}

export async function getAWithdrawal(req, res) {
  try {
    const user_email = req.user_email;
    const data = await getWithdrawal(user_email, req.body);
    if (data === "Invalid Request") {
      return res.status(400).json({ error: "Error Invalid Request" });
    }
    if (!data) {
      return res
        .status(400)
        .json({ error: " No withdrawal with specified id found" });
    }
    if (data === "You are not allowed to carry out this action") {
      return res
        .status(400)
        .json({ error: "You are not allowed to carry out this action" });
    }
    return res.status(201).json({
      message: "Withdrawal details",
      details: data,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
}

export async function getWithdrawalOnAnAccount(req, res) {
  try {
    const user_email = req.user_email;
    const data = await getWithdrawalsOnAccount(user_email, req.body);
    if (data === "Invalid Request") {
      return res.status(400).json({ error: "Error Invalid Request" });
    }
    if (!data) {
      return res.status(400).json({ error: "No withdrawals found" });
    }
    if (data === "You are not allowed to carry out this action") {
      return res
        .status(400)
        .json({ error: "You are not allowed to carry out this action" });
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
