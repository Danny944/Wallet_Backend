import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import adminRoute from "./src/routes/adminRoute.js";
import authUserRoute from "./src/routes/userAuthroute.js";
import accountRoute from "./src/routes/accountRoute.js";
import depositRoute from "./src/routes/depositRoute.js";
import transferRoute from "./src/routes/transferRoute.js";
import billRoute from "./src/routes/billRoute.js";
import withdrawalsRoute from "./src/routes/withdrawalRoute.js";
import transactionRoute from "./src/routes/transactionRoute.js";
import morgan from "morgan";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
//import { authUser } from "./src/middlewares/authuser.js";

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
// app.use(authUser);
app.use("/admin", adminRoute);
app.use("/account", accountRoute);
app.use("/deposit", depositRoute);
app.use("/transfer", transferRoute);
app.use("/bill-payment", billRoute);
app.use("/withdraw", withdrawalsRoute);
app.use("/transaction", transactionRoute);

app.listen(6000, () => {
  console.log("Server running on port 6000");
});
