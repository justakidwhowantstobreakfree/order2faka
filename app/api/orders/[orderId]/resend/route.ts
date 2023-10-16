import { ObjectId } from '@/utils/objectId'
import { sendKami } from '@/lib/mailer'
import { OrderModel } from '@/models/order'
import { NextResponse } from 'next/server'

interface Context {
  params: {
    orderId: string
  }
}

export const POST = async function (req: Request, { params }: Context) {
  const body: { email: string } = await req.json()
  const order = await OrderModel.findOne({ _id: new ObjectId(params.orderId) })
  if (!order) {
    return NextResponse.json(
      {
        error: 'no such order',
      },
      {
        status: 404,
      }
    )
  }

  if (order.status === 'paid') {
    await sendKami(body.email, order.kami)
    return Response.json({})
  } else {
    return NextResponse.json(
      {
        error: 'not paid yet',
      },
      {
        status: 403,
      }
    )
  }
}
