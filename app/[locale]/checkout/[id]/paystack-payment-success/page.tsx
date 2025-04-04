import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { getOrderById } from '@/lib/actions/order.actions'

type Props = {
  params: { id: string }
  searchParams: { reference: string }
}

export default async function SuccessPage({ params, searchParams }: Props) {
  const { id } = params
  const { reference } = searchParams

  const order = await getOrderById(id)
  if (!order) notFound()

  // Verify Paystack Payment
  const response = await fetch(
    `https://api.paystack.co/transaction/verify/${reference}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      },
      cache: 'no-store',
    }
  )
  const data = await response.json()

  const isSuccess = data?.data?.status === 'success'

  if (!isSuccess || order.isPaid || order.paymentResult?.status === 'success') {
    return redirect(`/checkout/${id}`)
  }

  return (
    <div className='max-w-4xl w-full mx-auto space-y-8'>
      <div className='flex flex-col gap-6 items-center'>
        <h1 className='font-bold text-2xl lg:text-3xl'>
          Thanks for your purchase
        </h1>
        <div>We are now processing your order.</div>
        <Button asChild>
          <Link href={`/account/orders/${id}`}>View order</Link>
        </Button>
      </div>
    </div>
  )
}



// import Link from 'next/link'
// import { notFound, redirect } from 'next/navigation'
// import { Button } from '@/components/ui/button'
// import { getOrderById } from '@/lib/actions/order.actions'

// type Props = {
//   params: { id: string }
//   searchParams: { reference: string }
// }

// export default async function SuccessPage({ params, searchParams }: Props) {
//   const { id } = params
//   const { reference } = searchParams
//   const order = await getOrderById(id)
//   if (!order) notFound()

//   // Verify Paystack Payment
//   const response = await fetch(
//     `https://api.paystack.co/transaction/verify/${reference}`,
//     {
//       headers: {
//         Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
//       },
//     }
//   )
//   const data = await response.json()

//   const isSuccess = data?.data?.status === 'success'

//   if (!isSuccess) return redirect(`/checkout/${id}`)
//   if (order.isPaid) return redirect(`/checkout/${id}`)
//   if (order.paymentResult?.status === 'success')
//     return redirect(`/checkout/${id}`)

//   return (
//     <div className='max-w-4xl w-full mx-auto space-y-8'>
//       <div className='flex flex-col gap-6 items-center '>
//         <h1 className='font-bold text-2xl lg:text-3xl'>
//           Thanks for your purchase
//         </h1>
//         <div>We are now processing your order.</div>
//         <Button asChild>
//           <Link href={`/account/orders/${id}`}>View order</Link>
//         </Button>
//       </div>
//     </div>
//   )
// }
