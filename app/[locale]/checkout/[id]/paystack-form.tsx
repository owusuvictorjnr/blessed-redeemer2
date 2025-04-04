'use client';
import { Button } from '@/components/ui/button';
import { IOrder } from '@/lib/db/models/order.model';
import { useRouter } from 'next/navigation';
// import PaystackPop from '@paystack/inline-js'


export default function PaystackForm({ order, paystackUrl }: { order: IOrder; paystackUrl: string | null }) {
  const router = useRouter();

  return (
    <div>
      <div className='text-xl'>Paystack Checkout</div>
      <Button
        className='w-full'
        size='lg'
        onClick={() => window.location.href = paystackUrl || '#'}
        disabled={!paystackUrl}
      >
        Proceed to Paystack
      </Button>
    </div>
  );
}