import express from "express";
const transferRoute = express.Router();

import { transferToAnAccount } from "../controllers/transfers.js";
import { authUser } from "../middlewares/authuser.js";

transferRoute.post("/transfer-to-account", authUser, transferToAnAccount);

export default transferRoute;
