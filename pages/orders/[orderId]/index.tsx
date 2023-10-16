import { ObjectId } from '@/utils/objectId'
import { OrderModel } from '@/models/order'
import { Box, Button, Radio, RadioGroup, Input } from '@chakra-ui/react'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { PayshiftChannel } from 'payshift'
import { useCallback, useState } from 'react'
import qrcode from 'qrcode'
import Image from 'next/image'

export const getServerSideProps = async function (context) {
  const orderId = String(context.query.orderId)
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
        const res = await fetch(`/orders/${props.order._id}/pay`, {
          method: 'POST',
          body: JSON.stringify({
            email,
            channel,
          }),
        })
        const data = await res.json()
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
    [setQrcodeData, channel, email, props]
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
        <Image
          src={qrcodeData}
          alt="qrcode"
        ></Image>
      )}
    </Box>
  )
}

export default OrderPage
