import mongoose from 'mongoose'

let connected = false

export const connectDbIfNeeded = async function () {
  if (!connected) {
    await mongoose.connect('mongodb://127.0.0.1:27017/order2faka')
    connected = true
  }
}

export const ObjectId = mongoose.Schema.Types.ObjectId
