import mongoose from 'mongoose'
import type { PayshiftChannel } from 'payshift'

export interface Order {
  outTradeNo: string
  amount: number
  currency: string
  email: string
  title: string
  description?: string
  clientIp: string
  userAgent?: string
  status: 'created' | 'paid'
  createdAt: Date
  kami: string
  payurl?: string
  qrcode?: string
  merchantId: string
  channel: PayshiftChannel
  notifyUrl?: string
  returnUrl?: string
}

export type NewOrder = Omit<Order, 'createdAt' | 'status' | 'email' | 'channel'>

const schema = new mongoose.Schema<Order>({
  outTradeNo: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    enum: ['CNY', 'JPY', 'EUR', 'USD'],
    required: true,
  },
  email: {
    type: String,
    required: false,
    validate: {
      validator(value: string) {
        return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(value)
      },
      message: (props: { value: string }) => `${props.value} is not email`,
    },
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
  clientIp: {
    type: String,
    required: true,
  },
  userAgent: {
    type: String,
    required: false,
  },
  status: {
    type: String,
    enum: ['created', 'paid'],
    required: true,
    default: 'created',
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  kami: {
    type: String,
    required: true,
  },
  payurl: {
    type: String,
    required: false,
  },
  qrcode: {
    type: String,
    required: false,
  },
  merchantId: {
    type: String,
    required: true,
  },
  channel: {
    type: String,
    required: false,
  },
  notifyUrl: {
    type: String,
    required: false,
  },
  returnUrl: {
    type: String,
    required: false,
  },
})

mongoose.connect('mongodb://127.0.0.1:27017/order2faka')

export const OrderModel: mongoose.Model<Order> =
  mongoose.models.Order || mongoose.model('Order', schema)
