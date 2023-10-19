import type { ChargeCreateParams } from 'payshift'
import { type NewOrder, OrderModel } from '@/models/order'
import { generateKami } from '@/lib/kami'
import { ObjectId } from '@/utils/objectId'
import { MerchantModel } from '@/models/merchant'
import { NextRequest, NextResponse } from 'next/server'
import { createHash } from 'crypto'

interface RequestBody extends ChargeCreateParams {
  notifyUrl?: string
  merchantId: string
  merchantKeyHash: string
}

export const POST = async function (req: Request) {
  const body: RequestBody = await req.json()

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

  const oldOrder = await OrderModel.findOne({
    merchantId: body.merchantId,
    outTradeNo: body.outTradeNo,
  })

  if (oldOrder) {
    return Response.json({
      url: new URL(
        `/orders/${oldOrder._id.toString()}`,
        process.env.HOST
      ).toString(),
    })
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

export const GET = async function (req: NextRequest) {
  const { searchParams } = req.nextUrl
  const kami = String(searchParams.get('kami'))
  const merchantKeyHash = String(searchParams.get('merchantKeyHash'))

  const order = await OrderModel.findOne({
    kami,
  })

  if (!order || order.status !== 'paid') {
    return Response.json({
      paid: false,
    })
  }

  const merchant = await MerchantModel.findOne({
    _id: new ObjectId(order.merchantId),
  })

  if (!merchant) {
    return Response.json({
      paid: false,
    })
  }

  const keyHash = createHash('md5')
    .update(`${order.outTradeNo}${merchant.key}`)
    .digest('hex')

  if (keyHash !== merchantKeyHash) {
    return Response.json({
      paid: false,
    })
  }

  return Response.json({
    paid: true,
  })
}
