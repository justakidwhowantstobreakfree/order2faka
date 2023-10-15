import { ChakraProvider } from '@chakra-ui/react'
import React from 'react'
import type { AppProps } from 'next/app'

const App = function ({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider>
      <Component {...pageProps}></Component>
    </ChakraProvider>
  )
}

export default App
