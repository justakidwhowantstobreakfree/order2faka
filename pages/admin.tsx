import { EPayModel } from '@/models/epay'
import { MerchantModel } from '@/models/merchant'
import {
  Box,
  Input,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Heading,
} from '@chakra-ui/react'
import { InferGetStaticPropsType } from 'next'
import { useCallback, useState } from 'react'

export const getStaticProps = async function () {
  const [merchants, epays] = await Promise.all([
    MerchantModel.find().lean(),
    EPayModel.find().lean(),
  ])
  return {
    props: {
      merchants: merchants.map((merchant) => {
        return {
          ...merchant,
          _id: merchant._id.toString(),
        }
      }),
      epays: epays.map((epay) => {
        return {
          ...epay,
          _id: epay._id.toString(),
        }
      }),
    },
  }
}

// TODO: verify token
const Admin = function (props: InferGetStaticPropsType<typeof getStaticProps>) {
  const [endpoint, setEndpoint] = useState('')
  const [key, setKey] = useState('')
  const [pid, setPid] = useState<number | null>(null)
  const [merchants, setMerchants] = useState(props.merchants)
  const [epays, setEPays] = useState(props.epays)

  const addProcessor = useCallback(
    async function () {
      try {
        const res = await fetch('/api/epays', {
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
        const { epays: newEPays } = await res.json()
        setEPays(newEPays)
      } catch (err) {
        console.error(err)
      }
    },
    [setEPays, pid, key, endpoint]
  )

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
      <Box marginBottom={'1em'}>
        <Heading>EPay Instances</Heading>
        <TableContainer>
          <Table>
            <Thead>
              <Tr>
                <Th>endpoint</Th>
                <Th>key</Th>
                <Th>pid</Th>
              </Tr>
            </Thead>
            <Tbody>
              {epays.map((epay, index) => {
                return (
                  <Tr key={index}>
                    <Td>{epay.endpoint}</Td>
                    <Td>{epay.key}</Td>
                    <Td>{epay.pid}</Td>
                  </Tr>
                )
              })}
            </Tbody>
          </Table>
        </TableContainer>
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

      <Box marginBottom={'1em'}>
        <Heading>Merchants</Heading>
        <TableContainer>
          <Table>
            <Thead>
              <Tr>
                <Th>id</Th>
                <Th>key</Th>
              </Tr>
            </Thead>
            <Tbody>
              {merchants.map((merchant, index) => {
                return (
                  <Tr key={index}>
                    <Td>{merchant._id}</Td>
                    <Td>{merchant.key}</Td>
                  </Tr>
                )
              })}
            </Tbody>
          </Table>
        </TableContainer>
        <Button onClick={addMerchant}>Generate Merchant</Button>
      </Box>
    </Box>
  )
}

export default Admin
