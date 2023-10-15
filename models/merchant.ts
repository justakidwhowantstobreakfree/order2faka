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

export const MerchantModel = mongoose.model('Merchant', schema)
