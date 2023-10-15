import type { ChargeCreateParams } from 'payshift'
import { type NewOrder, OrderModel } from '@/models/order'
import { generateKami } from '@/lib/kami'
import { connectDbIfNeeded } from '@/lib/db'

interface RequestBody extends ChargeCreateParams {
  notifyUrl?: string
}

export const POST = async function (req: Request) {
  const body: RequestBody = await req.json()
  await connectDbIfNeeded()
  const kami = await generateKami()

  const orderData: NewOrder = {
    kami,
    title: body.title,
    outTradeNo: body.outTradeNo,
    description: body.description,
    amount: body.amount,
    currency: body.currency,
    clientIp: body.clientIp,
    userAgent: body.userAgent,
    merchatId: 'self',
    notifyUrl: body.notifyUrl,
  }

  const order = new OrderModel(orderData)
  const savedOrder = await order.save()

  return Response.json({
    url: new URL(
      `/orders/${savedOrder._id.toString()}`,
      process.env.HOST
    ).toString(),
  })
}
