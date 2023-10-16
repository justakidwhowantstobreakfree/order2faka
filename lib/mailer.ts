import { OrderModel } from '@/models/order'
import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST as string,
  port: Number(process.env.EMAIL_PORT),
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
})

export const sendKami = async function (email: string, kami: string) {
  try {
    await transporter.sendMail({
      to: email,
      subject: `You Gift Code is ${kami}`,
      text: `You just purchased a gift card on ${process.env.HOST}, You Gift Code is ${kami}`,
    })

    await OrderModel.updateOne(
      {
        kami,
      },
      {
        $set: {
          emailNotified: true,
        },
      }
    )
  } catch (err) {
    console.error(err)
    console.log('retry after 5 secs')
    await new Promise((resolve) => {
      setTimeout(() => {
        resolve(null)
      }, 5000)
    })
    await sendKami(email, kami)
  }
}
