import { Box } from '@chakra-ui/react'
import { useRouter } from 'next/router'

const Result = function () {
  const router = useRouter()
  console.log(router.query.orderId)
  return <Box></Box>
}

export default Result
