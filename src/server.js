import express from "express";
import bodyParser from "body-parser";
import logger from "./config/logger.js";
import cors from "cors";
import superAdminRoute from "./routes/superAdminRoute.js";
import adminRoute from "./routes/adminRoute.js";
import authUserRoute from "./routes/userAuthroute.js";
import accountRoute from "./routes/accountRoute.js";
import depositRoute from "./routes/depositRoute.js";
import transferRoute from "./routes/transferRoute.js";
import billRoute from "./routes/billRoute.js";
import withdrawalsRoute from "./routes/withdrawalRoute.js";
import transactionRoute from "./routes/transactionRoute.js";
import morgan from "morgan";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

let accessLogStream = fs.createWriteStream(join(__dirname, "access.log"), {
  flags: "a",
});

app.use(morgan("combined"));

app.use(morgan("combined", { stream: accessLogStream }));

app.use(bodyParser.json());
app.use(cors());

app.use("/authUser", authUserRoute);
app.use("/superAdmin", superAdminRoute);
app.use("/admin", adminRoute);
app.use("/account", accountRoute);
app.use("/deposit", depositRoute);
app.use("/transfer", transferRoute);
app.use("/bill-payment", billRoute);
app.use("/withdraw", withdrawalsRoute);
app.use("/transaction", transactionRoute);

app.listen(6000, () => {
  logger.info("Server running on port 6000");
});
