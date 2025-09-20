import Head from 'next/head'
import {
  Box,
  Heading,
  Container,
  Text,
  Button,
  Stack,
  Icon,
  useColorModeValue,
  createIcon,
} from '@chakra-ui/react'
export default function Home() {
  return (
   <>
      <Container maxW={'3xl'}>
        <Stack
          as={Box}
          textAlign={'center'}
          spacing={{ base: 8, md: 14 }}
          py={{ base: 20, md: 36 }}>
          <Heading
            fontWeight={600}
            fontSize={{ base: '2xl', sm: '4xl', md: '6xl' }}
            lineHeight={'110%'}>
            Bienvenido a mi sitio  <br />
            <Text as={'span'} color={'green.300'}>
              Academico
            </Text>
          </Heading>
          <Text color={'gray.500'}>
           Este es mi rincón digital donde subo métodos, algoritmos y experimentos random de la U. Si aprendes algo, genial. Si no te gusta… pues F*ck.
          </Text>
        </Stack>
      </Container>
    </>
  )
}
