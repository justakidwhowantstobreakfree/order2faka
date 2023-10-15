import type { ChargeCreateParams } from 'payshift'
import { type NewOrder, OrderModel } from '@/models/order'
import { generateKami } from '@/lib/kami'
import { ObjectId, connectDbIfNeeded } from '@/lib/db'
import { MerchantModel } from '@/models/merchant'
import { NextResponse } from 'next/server'
import { createHash } from 'crypto'

interface RequestBody extends ChargeCreateParams {
  notifyUrl?: string
  merchantId: string
  merchantKeyHash: string
}

export const POST = async function (req: Request) {
  const body: RequestBody = await req.json()
  await connectDbIfNeeded()

  const merchant = await MerchantModel.findOne({
    _id: new ObjectId(body.merchantId),
  })

  if (!merchant) {
    return NextResponse.json(
      {
        error: 'no such merchant',
      },
      {
        status: 404,
      }
    )
  }

  const keyHash = createHash('md5')
    .update(`${body.outTradeNo}${merchant.key}`)
    .digest('hex')

  if (keyHash !== body.merchantKeyHash) {
    return NextResponse.json(
      {
        error: 'merchant key not matched',
      },
      {
        status: 401,
      }
    )
  }

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
    merchantId: body.merchantId,
    notifyUrl: body.notifyUrl,
    returnUrl: body.returnUrl,
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
