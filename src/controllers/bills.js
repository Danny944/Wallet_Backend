import { makeBillPayment } from "../models/bills.js";
import { getBillPayment } from "../models/bills.js";
import { getBillsOnAccount } from "../models/bills.js";

export async function makeABillPayment(req, res) {
  try {
    const user_email = req.user_email;
    const data = await makeBillPayment(user_email, req.body);
    if (data === "Invalid Request") {
      return res.status(400).json({ error: "Error Invalid Request" });
    }
    if (data === "We currently do not support this bill type at the moment") {
      return res.status(400).json({
        error: "We currently do not support this bill type at the moment",
      });
    }
    if (data === "You are not allowed to carry out this action") {
      return res
        .status(400)
        .json({ error: "You are not allowed to carry out this action" });
    }
    if (data === "Insufficient funds") {
      return res.status(400).json({
        error: "You do not have sufficient funds to complete this transaction",
      });
    }
    if (data === "Bill account doesn't exist") {
      return res.status(400).json({
        error: "Bill account doesn't exist",
      });
    }
    return res.status(201).json({
      message: "Bill payment successful",
      bill_details: data,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
}

export async function getABillPayment(req, res) {
  try {
    const user_email = req.user_email;
    const data = await getBillPayment(user_email, req.body);
    if (data === "Invalid Request") {
      return res.status(400).json({ error: "Error Invalid Request" });
    }
    if (!data) {
      return res.status(400).json({
        error: "No bill history with Id ",
      });
    }
    if (data === "You are not allowed to carry out this action") {
      return res
        .status(400)
        .json({ error: "You are not allowed to carry out this action" });
    }
    return res.status(201).json({
      message: "Bill Payment",
      bill_details: data,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
}

export async function getBillsOnAnAccount(req, res) {
  try {
    const user_email = req.user_email;
    const data = await getBillsOnAccount(user_email, req.body);
    if (data === "Invalid Request") {
      return res.status(400).json({ error: "Error Invalid Request" });
    }
    if (data === "No Bills Associated with this account") {
      return res
        .status(400)
        .json({ error: "No Bills Associated with this account" });
    }
    if (data === "You are not allowed to carry out this action") {
      return res
        .status(400)
        .json({ error: "You are not allowed to carry out this action" });
    }

    return res.status(201).json({
      message: "Bill payments",
      details: data,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
}
