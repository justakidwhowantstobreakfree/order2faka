import { ObjectId, connectDbIfNeeded } from '@/lib/db'
import { sendKami } from '@/lib/mailer'
import { getPayshift } from '@/lib/payshift'
import { MerchantModel } from '@/models/merchant'
import { OrderModel } from '@/models/order'
import { createHash } from 'crypto'
import { NextResponse } from 'next/server'
import { PayshiftChannel, type CurrencyCode } from 'payshift'

interface Context {
  params: {
    orderId: string
  }
}

const setupWebhook = async function () {
  const payshift = await getPayshift()
  payshift.on('charge.succeeded', async (event) => {
    await connectDbIfNeeded()
    const order = await OrderModel.findOne({
      outTradeNo: event.outTradeNo,
    })

    if (!order) {
      throw new Error('no such order')
    }

    await order.updateOne({
      status: 'paid',
    })

    await sendKami(order.email, order.kami)

    const merchant = await MerchantModel.findOne({
      _id: new ObjectId(order.merchantId),
    })

    if (!merchant) {
      throw new Error('no such merchant')
    }

    if (order.notifyUrl) {
      await fetch(order.notifyUrl, {
        method: 'POST',
        body: JSON.stringify({
          merchantKeyHash: createHash('md5')
            .update(`${order.outTradeNo}${merchant.key}`)
            .digest('hex'),
        }),
      })
    }
  })
}

setupWebhook()

export const POST = async function (req: Request, { params }: Context) {
  const body: { email: string; channel: PayshiftChannel } = await req.json()
  await connectDbIfNeeded()
  const order = await OrderModel.findOne({
    _id: new ObjectId(params.orderId),
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

  await OrderModel.updateOne(
    {
      _id: new ObjectId(params.orderId),
    },
    {
      email: body.email,
      channel: body.channel,
    }
  )

  const payshift = await getPayshift()
  const { data } = await payshift.createCharge({
    title: order.title,
    currency: order.currency as CurrencyCode,
    description: order.description,
    channel: body.channel,
    amount: order.amount,
    outTradeNo: order.outTradeNo,
    clientIp: order.clientIp,
    returnUrl: new URL(
      `/orders/${order._id.toString()}/result`,
      process.env.HOST
    ).toString(),
  })

  return Response.json({
    payurl: data.payurl,
    qrcode: data.qrcode,
  })
}
