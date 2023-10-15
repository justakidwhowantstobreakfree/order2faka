import { Box, Input, Button } from '@chakra-ui/react'
import { useCallback, useState } from 'react'

const Resend = function () {
  const [orderId, setOrderId] = useState('')
  const [email, setEmail] = useState('')

  const resend = useCallback(async () => {
    try {
      await fetch(`/orders/${orderId}/resend`, {
        method: 'POST',
        body: JSON.stringify({
          email,
        }),
      })
    } catch (err) {
      console.error(err)
    }
  }, [orderId, email])

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
