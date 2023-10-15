import { Box, Input, Button } from '@chakra-ui/react'
import { useState } from 'react'

// TODO: verify token
const Admin = function () {
  const [endpoint, setEndpoint] = useState('')
  const [key, setKey] = useState('')
  const [pid, setPid] = useState<number | null>(null)

  const add = async function () {
    console.log(endpoint, key, pid)
  }

  return (
    <Box>
      <Input
        placeholder="endpoint"
        type="url"
        onChange={(e) => {
          setEndpoint(e.target.value)
        }}
      ></Input>
      <Input
        placeholder="key"
        onChange={(e) => {
          setKey(e.target.value)
        }}
      ></Input>
      <Input
        placeholder="pid"
        type="number"
        onChange={(e) => {
          setPid(Number(e.target.value))
        }}
      ></Input>
      <Button onClick={add}>Add EPay Instance</Button>
    </Box>
  )
}

export default Admin
