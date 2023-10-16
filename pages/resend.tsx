import { Box, Input, Button, Text } from '@chakra-ui/react'
import { useCallback, useState } from 'react'

const Resend = function () {
  const [orderId, setOrderId] = useState('')
  const [email, setEmail] = useState('')
  const [sentEmail, setSentEmail] = useState('')

  const resend = useCallback(async () => {
    try {
      const res = await fetch(`/orders/${orderId}/resend`, {
        method: 'POST',
        body: JSON.stringify({
          email,
        }),
      })
      const { email: sentEmail } = await res.json()
      setSentEmail(sentEmail)
    } catch (err) {
      console.error(err)
    }
  }, [orderId, setSentEmail, email])

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

      {sentEmail && <Text>Gift Code has been sent to {sentEmail}</Text>}
    </Box>
  )
}

export default Resend
