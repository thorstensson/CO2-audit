import { createChallenge, randomInt } from 'altcha-lib'
import { deriveKey } from 'altcha-lib/algorithms/pbkdf2'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()

  // Official JS/TS v2 implementation signature
  const challenge = await createChallenge({
    algorithm: 'PBKDF2/SHA-256',
    cost: 1000, // Computational difficulty
    counter: randomInt(5_000, 10_000), // Starts random calculation point
    deriveKey: deriveKey, // Injected PBKDF2 function from library
    hmacSignatureSecret: config.altchaHmacKey,
  })

  return challenge
})
