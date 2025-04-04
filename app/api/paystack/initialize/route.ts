import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: Request) {
  try {
    const { email, amount, phone } = await req.json();

    if (!email || !amount || !phone) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const paystackResponse = await axios.post(
      "https://api.paystack.co/transaction/initialize",
      {
        email,
        amount: amount * 100, // Paystack expects the amount in cedis
        currency: "GHS",
        callback_url: process.env.NEXT_PUBLIC_PAYSTACK_CALLBACK_URL,
        metadata: { phone },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    return NextResponse.json(paystackResponse.data);
  } catch (error) {
    console.error("Paystack Error:", error);
    return NextResponse.json({ error: "Failed to initialize payment" }, { status: 500 });
  }
}
