import { ObjectId, connectDbIfNeeded } from '@/lib/db'
import { OrderModel } from '@/models/order'
import { NextResponse } from 'next/server'

interface Context {
  params: {
    orderId: string
  }
}

// TODO: verify token in http headers
export const GET = async function (req: Request, { params }: Context) {
  const orderId = params.orderId

  await connectDbIfNeeded()

  const order = await OrderModel.findOne({
    _id: new ObjectId(orderId),
  })

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

  return Response.json(order)
}
