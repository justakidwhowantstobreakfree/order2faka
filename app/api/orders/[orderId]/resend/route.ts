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
  const { email } = await req.json()
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

  if (email !== order.email) {
    return NextResponse.json(
      {
        error: 'not this email',
      },
      {
        status: 401,
      }
    )
  }

  if (order.status !== 'paid') {
    await sendKami(order.email, order.kami)
    const components = order.email.split('@')
    return Response.json({
      email: `${components[0].slice(0, -4)}***@${components[1]}`,
    })
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
