import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const url = new URL(req.url)
  const reference = url.searchParams.get('reference')

  if (!reference) {
    return NextResponse.json({ error: 'No reference found' }, { status: 400 })
  }

  try {
    const response = await fetch(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      }
    )

    const data = await response.json()
    if (data.status) {
      return NextResponse.json({ success: true, data: data.data })
    } else {
      return NextResponse.json(
        { error: 'Verification failed' },
        { status: 400 }
      )
    }
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
