import mongoose from 'mongoose'

export interface EPayCredential {
  endpoint: string
  key: string
  pid: number
}

const schema = new mongoose.Schema<EPayCredential>({
  endpoint: {
    type: String,
    required: true,
  },
  key: {
    type: String,
    required: true,
  },
  pid: {
    type: Number,
    required: true,
  },
})

export const EPayModel = mongoose.model('Epay', schema)
