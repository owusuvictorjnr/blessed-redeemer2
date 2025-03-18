import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

import { sendPurchaseReceipt } from '@/emails'
import Order from '@/lib/db/models/order.model'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)

export async function POST(req: NextRequest) {
  const payload = await req.text(); // Await the request body text
  const signature = req.headers.get('stripe-signature') as string;

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      payload,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET as string
    );
  } catch (err) {
    console.error('Stripe webhook signature verification failed:', err);
    return new NextResponse('Webhook Error: Invalid signature', { status: 400 });
  }

  if (event.type === 'charge.succeeded') {
    const charge = event.data.object;
    const orderId = charge.metadata.orderId;
    const email = charge.billing_details.email;
    const pricePaidInCents = charge.amount;
    const order = await Order.findById(orderId).populate('user', 'email');
    if (order == null) {
      return new NextResponse('Bad Request', { status: 400 });
    }

    order.isPaid = true;
    order.paidAt = new Date();
    order.paymentResult = {
      id: event.id,
      status: 'COMPLETED',
      email_address: email!,
      pricePaid: (pricePaidInCents / 100).toFixed(2),
    };
    await order.save();
    try {
      await sendPurchaseReceipt({ order });
    } catch (err) {
      console.log('email error', err);
    }
    return NextResponse.json({
      message: 'updateOrderToPaid was successful',
    });
  }
  return new NextResponse();
}
