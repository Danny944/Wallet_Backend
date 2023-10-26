/*
/accounts/:id/bill

// Get Specific Bill Payment Information
/accounts/:id/bill/:billId
*/

import client from "../config/db.js";
import { payBillSchema } from "../validation/Schemas.js";
import { getBillSchema } from "../validation/Schemas.js";

async function getAccountBalance(account_number) {
  const query = `
    SELECT account_balance 
    FROM account 
    WHERE account_number = $1`;
  const { rows } = await client.query(query, [account_number]);
  return rows[0].account_balance;
}

async function updateAccountBalance(account_number, amount) {
  const query = `
    UPDATE account
    SET account_balance = $1
    WHERE account_number = $2
    RETURNING *
  `;
  const values = [amount, account_number];
  const result = await client.query(query, values);
  return result.rows[0];
}

// Make a bill payment
export async function makeBillPayment(user_email, payload) {
  const { error, value } = payBillSchema.validate(payload);
  if (error) {
    console.log(error);
    return "Invalid Request";
  }
  const {
    account_number,
    bill_type,
    bill_account,
    amount,
    currency_code,
    description,
  } = value;
  try {
    const account_balance = await getAccountBalance(account_number);
    if (account_balance < amount) {
      console.log("Insufficient funds");
      return "Insufficient funds";
    }
    const new_balance_sender = account_balance - amount;

    const receiver_balance = await getAccountBalance(bill_account);
    if (!receiver_balance) {
      return "Bill account doesn't exist";
    }
    console.log(`reciever account correct, balance: ${receiver_balance}`);
    const new_balance_receiver = receiver_balance + amount;

    const result3 = await updateAccountBalance(
      account_number,
      new_balance_sender
    );
    console.log(result3);
    const result4 = await updateAccountBalance(
      bill_account,
      new_balance_receiver
    );
    console.log(result4);

    const query5 = `
    INSERT INTO bills (user_email, bill_type, description, account_number, currency_code, amount )
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    `;
    const values5 = [
      user_email,
      bill_type,
      description,
      account_number,
      currency_code,
      amount,
    ];
    const result5 = await client.query(query5, values5);
    console.log(result5.rows[0]);
    console.log("Bill payment successful");
    return result5.rows[0];
  } catch (err) {
    console.error(err.message);
    throw err;
  }
}

// Get Specific Bill Payment Information
// /accounts/:id/bill/:billId

export async function getBillPayment(payload) {
  const { value, error } = getBillSchema.validate(payload);
  if (error) {
    console.log(error);
    return "Invalid Request";
  }
  const { account_number, bill_id } = value;
  try {
    const query = `
    SELECT *
    FROM bills
    WHERE bill_id = $1 AND account_number = $2
  `;
    const values = [bill_id, account_number];
    const result = await client.query(query, values);
    if (!result.rows[0]) {
      console.log("No bill found");
      return false;
    }
    console.log(result.rows[0]);
    return result.rows[0];
  } catch (error) {
    console.error(err.message);
    throw err;
  }
}

// const payload = {
//   account_number: 1023456885,
//   bill_id: 1,
// };
// // const decoded = {
// //   user_email: "fadehandaniel2006@gmail.com",
// // };

// // makeBillPayment(decoded, payload);
// getBillPayment(payload);
