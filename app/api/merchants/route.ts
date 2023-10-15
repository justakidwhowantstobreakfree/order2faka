import { connectDbIfNeeded } from '@/lib/db'
import { MerchantModel } from '@/models/merchant'
import { createHash } from 'crypto'

export const POST = async function (req: Request) {
  await connectDbIfNeeded()
  const merchant = new MerchantModel({
    key: createHash('md5').update(String(performance.now())).digest('hex'),
  })
  await merchant.save()

  const merchants = await MerchantModel.find().lean()
  return Response.json({
    merchants,
  })
}
