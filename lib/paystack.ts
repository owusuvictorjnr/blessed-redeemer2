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
        callback_url: CALLBACK_URL,
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
  } catch {
    console.error('Paystack Error:')
    return null
  }
}
