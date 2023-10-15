import { ObjectId, connectDbIfNeeded } from '@/lib/db'
import { OrderModel } from '@/models/order'
import { Box, Button, Radio, RadioGroup, Input } from '@chakra-ui/react'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { PayshiftChannel } from 'payshift'
import { useCallback, useState } from 'react'
import axios from 'axios'
import qrcode from 'qrcode'

export const getServerSideProps = async function (context) {
  const orderId = String(context.query.orderId)
  await connectDbIfNeeded()
  const order = await OrderModel.findOne(new ObjectId(orderId)).lean()
  if (order === null) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      order,
    },
  }
} satisfies GetServerSideProps

const OrderPage = function (
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) {
  const channels: { name: string; value: PayshiftChannel }[] = [
    {
      name: '支付宝',
      value: 'epay_cluster_alipay',
    },
    {
      name: '微信支付',
      value: 'epay_cluster_wechat_pay',
    },
  ]
  const [email, setEmail] = useState('')
  const [channel, setChannel] = useState('epay_cluster_alipay')
  const [qrcodeData, setQrcodeData] = useState('')

  const pay = useCallback(
    async function () {
      try {
        const { data } = await axios.post(`/orders/${props.order._id}/pay`, {
          email,
          channel,
        })
        if (data.qrcode) {
          const dataurl = await qrcode.toDataURL(data.qrcode)
          setQrcodeData(dataurl)
        }
        if (data.payurl) {
          location.href = data.payurl
        }
      } catch (err) {
        console.error(err)
      }
    },
    [setQrcodeData]
  )

  return (
    <Box>
      <Input
        placeholder="Enter your email to receive your gift card number"
        type="email"
        onChange={(e) => {
          setEmail(e.target.value)
        }}
      ></Input>
      <RadioGroup
        defaultValue={channels[0].value}
        onChange={setChannel}
      >
        {channels.map((channel) => {
          return (
            <Radio
              key={channel.value}
              value={channel.value}
            >
              {channel.name}
            </Radio>
          )
        })}
      </RadioGroup>
      <Button onClick={pay}>Pay</Button>

      {qrcodeData && (
        <img
          src={qrcodeData}
          alt="qrcode"
        />
      )}
    </Box>
  )
}

export default OrderPage
