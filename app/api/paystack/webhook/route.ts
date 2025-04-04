import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const paystackSignature = req.headers.get("x-paystack-signature");

    if (!paystackSignature) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("Paystack Webhook Data:", body);

    if (body.event === "charge.success") {
      // Process successful payment
      console.log("✅ Payment successful for:", body.data.reference);
    }

    return NextResponse.json({ status: "Webhook received" });
  } catch (error) {
    console.error("Webhook Error:", error);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
// This code handles the Paystack webhook event. It checks for the event type and processes it accordingly.
// The webhook URL should be set in the Paystack dashboard to point to this endpoint.
// Make sure to secure this endpoint in production by verifying the Paystack signature.
// You can use the `paystackSignature` to verify the authenticity of the request.
// This is a basic implementation. In a real-world scenario, you would want to handle different event types
// and possibly store the payment information in your database.
// You can also add more error handling and logging as needed.
// This code is a basic implementation of a Paystack webhook handler in a Next.js API route.
// It listens for POST requests from Paystack, verifies the signature, and processes the payment event.
// You can expand this code to handle different event types and perform actions based on the event.
// Make sure to test this code thoroughly before deploying it to production.
// You can also add more error handling and logging as needed.
// This code is a basic implementation of a Paystack webhook handler in a Next.js API route.


// import { NextApiRequest, NextApiResponse } from 'next';
// import { updateOrderPaymentStatus } from '@/lib/actions/order.actions';

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   const secret = req.headers['x-paystack-signature'];
//   if (!secret) return res.status(401).json({ error: 'Unauthorized' });

//   const event = req.body;
//   if (event.event === 'charge.success') {
//     await updateOrderPaymentStatus(event.data.metadata.orderId, true);
//   }
//   res.status(200).send('OK');
// }
