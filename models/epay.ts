import mongoose from 'mongoose'
import { connectionString } from '@/utils/db'

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

mongoose.connect(connectionString)

export const EPayModel: mongoose.Model<EPayCredential> =
  mongoose.models.Epay || mongoose.model('Epay', schema)
