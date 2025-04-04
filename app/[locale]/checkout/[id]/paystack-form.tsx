'use client'
import { Button } from '@/components/ui/button'
import { IOrder } from '@/lib/db/models/order.model'

export default function PaystackForm({
  paystackUrl,
}: {
  order: IOrder
  paystackUrl: string | null
}) {
  return (
    <div>
      <div className='text-xl'>Paystack Checkout</div>
      <Button
        className='w-full'
        size='lg'
        onClick={() => (window.location.href = paystackUrl || '#')}
        disabled={!paystackUrl}
      >
        Proceed to Paystack
      </Button>
    </div>
  )
}
