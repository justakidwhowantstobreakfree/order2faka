import random from 'random'
import { OrderModel } from '@/models/order'
import { connectDbIfNeeded } from './db'

// 9 digits
const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9]
// 20 digits
const alphabets = [
  'A',
  'B',
  'C',
  'D',
  'E',
  'F',
  'G',
  'H',
  'K',
  'L',
  'M',
  'N',
  'P',
  'Q',
  'R',
  'T',
  'W',
  'X',
  'Y',
  'Z',
]
// 29 ^ 7 =  17249876309
const digits = 7

const ciphers = Array.from([...numbers, ...alphabets])

const generate = function () {
  const positions = []
  for (let index = 0; index < digits; index++) {
    positions.push(random.int(0, ciphers.length - 1))
  }
  return ciphers.join('')
}

export const generateKami = async function (): Promise<string> {
  const kami = generate()
  await connectDbIfNeeded()
  const order = await OrderModel.findOne({ kami })
  if (!order) {
    return kami
  }

  return await generateKami()
}
