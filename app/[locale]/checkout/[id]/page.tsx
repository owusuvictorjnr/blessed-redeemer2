import { notFound } from 'next/navigation'
import React from 'react'
import { auth } from '@/auth'
import { getOrderById } from '@/lib/actions/order.actions'
import PaymentForm from './payment-form'
import Stripe from 'stripe'
import { initializePaystackTransaction } from '@/lib/paystack'


export const metadata = {
  title: 'Payment',
}

const CheckoutPaymentPage = async (props: {
  params: Promise<{
    id: string
  }>
}) => {
  const params = await props.params

  const { id } = params

  const order = await getOrderById(id)
  if (!order) notFound()

  const session = await auth()

  let client_secret = null

  let paystack_url = null;

  if (order.paymentMethod === 'Stripe' && !order.isPaid) {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(order.totalPrice * 100),
      currency: 'USD',
      metadata: { orderId: order._id },
    })
    client_secret = paymentIntent.client_secret
  }else if (order.paymentMethod === 'Paystack' && !order.isPaid) {
    paystack_url = await initializePaystackTransaction(order);
  }


  return (
    <PaymentForm
      order={order}
      clientSecret={client_secret}
      paystackUrl={paystack_url}
      isAdmin={session?.user?.role === 'Admin' || false}
    />
  )
}

export default CheckoutPaymentPage
