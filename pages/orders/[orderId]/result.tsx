import { ObjectId, connectDbIfNeeded } from '@/lib/db'
import { OrderModel } from '@/models/order'
import { Box, Text } from '@chakra-ui/react'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'

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

const Result = function (
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) {
  // TODO: long polling order status if needed
  return (
    <Box>
      {props.order.kami && <Text>{props.order.kami}</Text>}
      <Text>not paid yet, querying</Text>
    </Box>
  )
}

export default Result
