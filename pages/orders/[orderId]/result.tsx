import { ObjectId } from '@/utils/objectId'
import { OrderModel } from '@/models/order'
import { Box, Text } from '@chakra-ui/react'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { useEffect, useState } from 'react'

export const getServerSideProps = async function (context) {
  const orderId = String(context.query.orderId)
  const order = await OrderModel.findOne(
    {
      _id: new ObjectId(orderId),
    },
    {
      status: 1,
      kami: 1,
    }
  ).lean()
  if (order === null) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      order: {
        ...order,
        _id: order._id.toString(),
      },
    },
  }
} satisfies GetServerSideProps

const Result = function (
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) {
  const maxTries = 20
  const [status, setStatus] = useState(props.order.status)

  useEffect(() => {
    let tries = 0

    const interval = setInterval(async () => {
      const res = await fetch(`/api/orders/${props.order._id}`)
      const { status } = await res.json()
      setStatus(status)
      tries++
      if (status === 'paid' || tries >= maxTries) {
        clearInterval(interval)
      }
    }, 3000)

    return () => clearInterval(interval)
  }, [setStatus, props.order._id])

  if (status === 'paid') {
    return (
      <Box>
        <Text>Your gift card number is {props.order.kami}</Text>
      </Box>
    )
  }

  return (
    <Box>
      <Text>
        not paid yet, maybe status not updated, please wait, querying...
      </Text>
    </Box>
  )
}

export default Result
