import { Payshift, EPayProvider, EPayClusterProvider } from 'payshift'
import { EPayModel } from '@/models/epay'

let _payshift: Payshift | null

export const getPayshift = async function (): Promise<Payshift> {
  if (!_payshift) {
    await reload()
    _payshift!.startWebServer(
      process.env.WEBHOOK_HOST as string,
      Number(process.env.WEBHOOK_PORT)
    )
  }

  return _payshift!
}

export const reload = async function () {
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
