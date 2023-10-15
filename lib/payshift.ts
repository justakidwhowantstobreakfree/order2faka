import { Payshift, EPayProvider, EPayClusterProvider } from 'payshift'
import { connectDbIfNeeded } from './db'
import { EPayModel } from '@/models/epay'

let _payshift: Payshift | null

export const getPayshift = async function (): Promise<Payshift> {
  if (_payshift === null) {
    await connectDbIfNeeded()
    await reload()
  }

  return _payshift!
}

export const reload = async function () {
  await connectDbIfNeeded()
  const credentials = await EPayModel.find()
  const providers = credentials.map((credential) => {
    return new EPayProvider(
      String(credential.endpoint),
      Number(credential.pid),
      String(credential.key)
    )
  })
  const provider = new EPayClusterProvider(providers)
  _payshift = new Payshift([provider])
}
