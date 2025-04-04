import { IOrder } from './db/models/order.model'
import axios from 'axios'

export async function initializePaystackTransaction(order: IOrder) {
  try {
    console.log('Order object before Paystack request:', order) // Debugging

    // Fix: Ensure user email is available
    const userEmail =
      typeof order.user === 'object' && 'email' in order.user
        ? order.user.email
        : order.userEmail || 'test@example.com'
    if (!userEmail) {
      throw new Error('User email is missing from order')
    }

    const API_KEY = process.env.PAYSTACK_SECRET_KEY
    const BASE_URL = process.env.PAYSTACK_BASE_URL
    const CALLBACK_URL = process.env.PAYSTACK_CALLBACK_URL

    interface PaystackResponse {
      data: {
        authorization_url: string
      }
    }

    const response = await axios.post<PaystackResponse>(
      `${BASE_URL}/transaction/initialize`,
      {
        email: userEmail, // ✅ Ensure email is sent
        amount: Math.round(order.totalPrice * 100), // Convert to pesewas
        currency: 'GHS', // Ensure Ghanaian Cedi is used
        reference: `order_${order._id}_${Date.now()}`,
        callback_url: process.env.PAYSTACK_CALLBACK_URL,
        channels: ['mobile_money', 'card'], // Ensure MoMo appears
      },
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    )

    const data = response.data
    console.log('Paystack Response:', data)

    return data.data.authorization_url // ✅ Return the URL correctly
  } catch (error) {
    console.error(
      'Paystack Error:',
      (error as any).response?.data || (error as any).message
    )
    return null
  }
}

// export async function initializePaystackTransaction(order: IOrder) {
//   const response = await fetch(
//     'https://api.paystack.co/transaction/initialize',
//     {
//       method: 'POST',
//       headers: {
//         Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         email: order.userEmail,
//         amount: Math.round(order.totalPrice * 100), // Convert to kobo
//         currency: 'GHS', // Ghanaian Cedis for Mobile Money
//         callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/${order._id}/paystack-success`,
//         metadata: { orderId: order._id },
//         reference: `order_${order._id}_${Date.now()}`, // Unique reference
//       }),
//     }
//   )

//   const data = await response.json()
//   return data.data.authorization_url // Ensure this value is returned
// }
