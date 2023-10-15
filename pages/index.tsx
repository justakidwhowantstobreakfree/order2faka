import { Box, Input, Button, Heading } from '@chakra-ui/react'

export default function Home() {
  return (
    <Box>
      <Heading>Gift Card Shop</Heading>
      <Input placeholder="Input shop item id to purchase"></Input>
      <Button>Purchase</Button>
    </Box>
  )
}
