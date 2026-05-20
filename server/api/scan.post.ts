import { verifySolution } from 'altcha-lib'
import { deriveKey } from 'altcha-lib/algorithms/pbkdf2'
import puppeteer from 'puppeteer'
import { co2 } from '@tgwf/co2'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { token } = body
  let url = body.url

  if (!url) {
    throw createError({ statusCode: 400, statusMessage: 'URL is required' })
  }

  if (!token) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Human verification token is missing',
    })
  }

  if (!/^https?:\/\//i.test(url)) {
    url = `https://${url}`
  }

  console.log('Verifying ALTCHA puzzle payload...')
  const config = useRuntimeConfig()

  let isHuman = false

  try {
    const decodedText = Buffer.from(token, 'base64').toString('utf-8')
    const parsedPayload = JSON.parse(decodedText)

    const result = await verifySolution({
      challenge: parsedPayload.challenge,
      solution: parsedPayload.solution,
      deriveKey: deriveKey,
      hmacSignatureSecret: config.altchaHmacKey || '',
    })

    isHuman = result.verified
  } catch (payloadError: any) {
    console.error(
      'Failed to parse or decode incoming token:',
      payloadError.message
    )
  }

  if (!isHuman) {
    console.error('ALTCHA security verification failed')
    throw createError({
      statusCode: 403,
      statusMessage: 'Verification failed. Bots are not allowed.',
    })
  }
  console.log('ALTCHA verification successful!')

  const isProd = process.env.NODE_ENV === 'production'
  let browser

  try {
    console.log(`Environment: ${isProd ? 'PRODUCTION' : 'DEVELOPMENT'}`)

    if (isProd) {
      const browserlessEndpoint = `wss://chrome.browserless.io?token=${process.env.BROWSERLESS_TOKEN}`
      browser = await puppeteer.connect({
        browserWSEndpoint: browserlessEndpoint,
      })
    } else {
      browser = await puppeteer.launch({
        headless: true,
        channel: 'chrome',
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      })
    }

    const page = await browser.newPage()

    const breakdownBytes = {
      html: 0,
      css: 0,
      javascript: 0,
      images: 0,
      fonts: 0,
      other: 0,
    }
    let totalBytes = 0

    // Collect all asynchronous processing tasks securely
    const processingPromises: Promise<void>[] = []

    page.on('response', (response) => {
      const status = response.status()
      if (status >= 200 && status < 400) {
        const resourceType = response.request().resourceType()

        // Push the async work execution block into the array
        const work = response
          .buffer()
          .then((buf) => {
            if (buf && buf.length > 0) {
              const bytes = buf.length
              totalBytes += bytes
              if (resourceType === 'document') breakdownBytes.html += bytes
              else if (resourceType === 'stylesheet')
                breakdownBytes.css += bytes
              else if (resourceType === 'script')
                breakdownBytes.javascript += bytes
              else if (resourceType === 'image' || resourceType === 'media')
                breakdownBytes.images += bytes
              else if (resourceType === 'font') breakdownBytes.fonts += bytes
              else breakdownBytes.other += bytes
            }
          })
          .catch(() => {
            // safely ignore analytic/tracking pixels or tracking drops
          })

        processingPromises.push(work)
      }
    })

    console.log('Navigating to:', url)
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 })
    console.log('Page loaded successfully')

    // Allow Browserless WebSocket to flush trailing async stream requests
    await new Promise((resolve) => setTimeout(resolve, 3000))

    // CRUCIAL: Force the main execution thread to wait until every background buffer has completely tabulated
    await Promise.all(processingPromises)

    const co2Emission = new co2({ model: '1byte' })
    const co2GramsResult = co2Emission.perByte(totalBytes)

    let finalCo2Grams = 0

    if (
      co2GramsResult &&
      typeof co2GramsResult === 'object' &&
      'total' in co2GramsResult
    ) {
      finalCo2Grams =
        typeof co2GramsResult.total === 'string'
          ? parseFloat(co2GramsResult.total)
          : co2GramsResult.total
    } else {
      finalCo2Grams =
        typeof co2GramsResult === 'string'
          ? parseFloat(co2GramsResult)
          : (co2GramsResult as number) || 0
    }

    console.log(
      'Scan result — totalBytes:',
      totalBytes,
      'breakdown:',
      JSON.stringify(breakdownBytes)
    )

    return {
      url,
      co2Grams: parseFloat(finalCo2Grams.toFixed(4)),
      breakdownBytes,
      lighthouseFakeRun: 1,
    }
  } catch (error: any) {
    console.error('====== SCAN ENDPOINT CRASHED ======')
    console.error(error)
    console.error('====================================')
    throw createError({ statusCode: 500, statusMessage: error.message })
  } finally {
    if (browser) {
      await browser.close()
    }
  }
})
