delete require.cache[require.resolve(__filename)]
import mongoose from 'mongoose'

export interface Merchant {
  key: string
}

const schema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
  },
})

mongoose.connect('mongodb://127.0.0.1:27017/order2faka')

export const MerchantModel: mongoose.Model<Merchant> =
  mongoose.models.Merchant || mongoose.model('Merchant', schema)
