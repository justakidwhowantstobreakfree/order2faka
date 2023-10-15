import { Box, Input, Button } from '@chakra-ui/react'
import { useCallback, useState } from 'react'
import axios from 'axios'

const Resend = function () {
  const [orderId, setOrderId] = useState('')
  const [email, setEmail] = useState('')

  const resend = useCallback(async () => {
    try {
      await axios.post(`/orders/${orderId}/resend`, {
        email,
      })
    } catch (err) {
      console.error(err)
    }
  }, [orderId])

  return (
    <Box>
      <Input
        placeholder="shop item id"
        onChange={(e) => setOrderId(e.target.value)}
      ></Input>
      <Input
        placeholder="purchaser email"
        onChange={(e) => setEmail(e.target.value)}
      ></Input>
      <Button onClick={resend}>Resend</Button>
    </Box>
  )
}

export default Resend
