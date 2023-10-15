import { connectDbIfNeeded } from '@/lib/db'
import { reload } from '@/lib/payshift'
import { EPayModel } from '@/models/epay'

export const POST = async function (req: Request) {
  const body = await req.json()

  await connectDbIfNeeded()

  const epay = new EPayModel({
    key: body.key,
    pid: body.pid,
    endpoint: body.endpoint,
  })

  await epay.save()
  await reload()
  return Response.json({})
}
