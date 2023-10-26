// GET /convert
import axios from "axios";

export async function currencyConverter(
  receiver_currency,
  sender_currency,
  amount
) {
  const apiKey = "A3cdWZEWju4CO0f1RnblKW9LRKirtb62";

  // Construct the URL with the actual values
  const url = `https://api.apilayer.com/exchangerates_data/convert?to=${receiver_currency}&from=${sender_currency}&amount=${amount}`;

  try {
    const response = await axios.get(url, {
      headers: {
        apikey: apiKey,
      },
    });

    const data = response.data;
    console.log(data);

    return data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}
