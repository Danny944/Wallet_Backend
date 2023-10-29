import express from "express";
const withdrawalsRoute = express.Router();

import { withdrawCash } from "../controllers/withdrawals.js";
import { getAWithdrawal } from "../controllers/withdrawals.js";
import { getWithdrawalOnAnAccount } from "../controllers/withdrawals.js";
import { authUser } from "../middlewares/authuser.js";
import { getWithdrawalsOnAccount } from "../models/withdrawals.js";

depositRoute.post("/withdraw-cash", authUser, withdrawCash);
depositRoute.get("/get-withdrawal", authUser, getAWithdrawal);
depositRoute.get("/get-all-withdrawals", authUser, getWithdrawalsOnAccount);

export default withdrawalsRoute;
