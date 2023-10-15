import { connectDbIfNeeded } from '@/lib/db'
import { MerchantModel } from '@/models/merchant'
import { Box, Input, Button, UnorderedList, ListItem } from '@chakra-ui/react'
import { InferGetStaticPropsType } from 'next'
import { useCallback, useState } from 'react'

export const getStaticProps = async function () {
  await connectDbIfNeeded()
  const merchants = await MerchantModel.find().lean()
  return {
    props: {
      merchants,
    },
  }
}

// TODO: verify token
const Admin = function (props: InferGetStaticPropsType<typeof getStaticProps>) {
  const [endpoint, setEndpoint] = useState('')
  const [key, setKey] = useState('')
  const [pid, setPid] = useState<number | null>(null)
  const [merchants, setMerchants] = useState(props.merchants)

  const addProcessor = async function () {
    try {
      await fetch('/api/epays', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pid,
          key,
          endpoint,
        }),
      })
    } catch (err) {
      console.error(err)
    }
  }

  const addMerchant = useCallback(async () => {
    try {
      const res = await fetch('/api/merchants', {
        method: 'POST',
      })
      const { merchants: newMerchants } = await res.json()
      setMerchants(newMerchants)
    } catch (err) {
      console.error(err)
    }
  }, [setMerchants])

  return (
    <Box>
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
        <Button onClick={addProcessor}>Add EPay Instance</Button>
      </Box>

      <Box>
        <UnorderedList>
          {merchants.map((merchant, index) => {
            return (
              <ListItem key={index}>
                {merchant._id.toString()}:{merchant.key}
              </ListItem>
            )
          })}
        </UnorderedList>

        <Button onClick={addMerchant}>Add Merchant</Button>
      </Box>
    </Box>
  )
}

export default Admin
