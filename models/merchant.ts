import mongoose from 'mongoose'
import { connectionString } from '@/utils/db'

export interface Merchant {
  key: string
}

const schema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
  },
})

mongoose.connect(connectionString)

export const MerchantModel: mongoose.Model<Merchant> =
  mongoose.models.Merchant || mongoose.model('Merchant', schema)
