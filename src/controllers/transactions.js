import { getAllTransactions } from "../models/transactions.js";

// Deposit funds into an account
export async function getAllTheTransactions(req, res) {
  try {
    const user_email = req.user_email;
    const data = await getAllTransactions(user_email);
    if (!data) {
      return res
        .status(400)
        .json({ error: "No transactions carried out on this profile" });
    }
    // if (data === "You are not allowed to carry out this action") {
    //   return res
    //     .status(400)
    //     .json({ error: "You are not allowed to carry out this action" });
    // }
    return res.status(201).json({
      message: "Transactions",
      Details: data,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
}
