import * as WebBrowser from "expo-web-browser";
import { Alert } from "react-native";
import { createId } from "./id";

/**
 * Interswitch Webpay Integration Configuration
 *
 * Requirements:
 * 1. MERCHANT_CODE from Interswitch
 * 2. PAY_ITEM_ID for the specific product/service
 * 3. MERCHANT_SECRET for hashing (server-side check)
 */

const INTERSWITCH_CONFIG = {
  TEST: {
    PAY_URL: "https://qa.interswitchng.com/collections/w/pay",
    VERIFY_URL: "https://qa.interswitchng.com/collections/api/v1/gettransaction.json",
  },
  PRODUCTION: {
    PAY_URL: "https://webpay.interswitchng.com/collections/w/pay",
    VERIFY_URL: "https://webpay.interswitchng.com/collections/api/v1/gettransaction.json",
  },
};

const IS_PRODUCTION = process.env.EXPO_PUBLIC_INTERSWITCH_MODE === "PRODUCTION";
const CONFIG = IS_PRODUCTION ? INTERSWITCH_CONFIG.PRODUCTION : INTERSWITCH_CONFIG.TEST;

const MERCHANT_CODE = process.env.EXPO_PUBLIC_INTERSWITCH_MERCHANT_CODE || "MX26070";
const CLIENT_ID = process.env.EXPO_PUBLIC_INTERSWITCH_CLIENT_ID;
const CLIENT_SECRET = process.env.EXPO_PUBLIC_INTERSWITCH_CLIENT_SECRET;
const CURRENCY = "566"; // NGN

export type PaymentParams = {
  amount: number; // Amount in Kobo (e.g. 1000 for N10.00)
  customerId: string;
  customerName: string;
  customerEmail: string;
  payItemId: string;
  transactionReference?: string;
};

/**
 * Initiates Interswitch Webpay payment flow via WebBrowser
 */
export async function initiateInterswitchPayment(params: PaymentParams): Promise<{ success: boolean; reference: string }> {
  const reference = params.transactionReference || createId("txn");
  const redirectUrl = "https://kontinueai.com/payment-callback"; // Should be a valid URL that Interswitch redirects to

  // Construct the Webpay URL with parameters
  // Reference: Interswitch Webpay integration docs
  const queryParams = new URLSearchParams({
    merchantcode: MERCHANT_CODE,
    payitemid: params.payItemId,
    amount: params.amount.toString(),
    txnref: reference,
    currency: CURRENCY,
    site_redirect_url: redirectUrl,
    cust_id: params.customerId,
    cust_name: params.customerName,
    cust_email: params.customerEmail,
  });

  const paymentUrl = `${CONFIG.PAY_URL}?${queryParams.toString()}`;

  try {
    const result = await WebBrowser.openAuthSessionAsync(paymentUrl, redirectUrl);

    if (result.type === "success") {
      // In a real app, you'd extract params from result.url and verify with your backend
      return { success: true, reference };
    }

    return { success: false, reference };
  } catch (error) {
    console.error("Interswitch Payment Error:", error);
    Alert.alert("Payment Error", "Could not initiate payment. Please try again.");
    return { success: false, reference };
  }
}

/**
 * Verifies transaction status with Interswitch API
 * IMPORTANT: This should ideally be done on the server-side to prevent tampering
 */
export async function verifyInterswitchTransaction(reference: string, amountInKobo: number): Promise<boolean> {
  const url = `${CONFIG.VERIFY_URL}?merchantcode=${MERCHANT_CODE}&transactionreference=${reference}&amount=${amountInKobo}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    // Response Code "00" usually means success in Interswitch
    return data?.ResponseCode === "00";
  } catch (error) {
    console.error("Interswitch Verification Error:", error);
    return false;
  }
}
