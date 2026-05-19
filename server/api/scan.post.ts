import { verifySolution } from 'altcha-lib'
import { deriveKey } from 'altcha-lib/algorithms/pbkdf2'
import puppeteer from 'puppeteer'
import { co2 } from '@tgwf/co2'

export default defineEventHandler(async (event) => {
  // 1. Get the URL and verification token from the client payload
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

  // URL Normalizer
  if (!/^https?:\/\//i.test(url)) {
    url = `https://${url}`
  }

  // 2. Validate the token using local ALTCHA cryptography
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

  // 3. Smart Browser Connection
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

    // 4. Track network bytes transfer size AND split them by resource categories
    let totalBytes = 0
    const breakdownBytes = {
      html: 0,
      css: 0,
      javascript: 0,
      images: 0,
      fonts: 0,
      other: 0,
    }

    page.on('response', (response) => {
      const status = response.status()
      if (status >= 200 && status < 400) {
        const headers = response.headers()
        const contentLength = headers['content-length']
        const resourceType = response.request().resourceType()

        let bytes = 0
        if (contentLength) {
          bytes = parseInt(contentLength, 10)
        }

        totalBytes += bytes

        // Sort bytes into matching breakdown buckets
        if (resourceType === 'document') {
          breakdownBytes.html += bytes
        } else if (resourceType === 'stylesheet') {
          breakdownBytes.css += bytes
        } else if (resourceType === 'script') {
          breakdownBytes.javascript += bytes
        } else if (resourceType === 'image' || resourceType === 'media') {
          breakdownBytes.images += bytes
        } else if (resourceType === 'font') {
          breakdownBytes.fonts += bytes
        } else {
          breakdownBytes.other += bytes
        }
      }
    })

    // 5. Navigate and wait for the page to load
    console.log('Navigating to:', url)
    const mainResponse = await page.goto(url, {
      waitUntil: 'load',
      timeout: 60000,
    })
    console.log('Page loaded successfully')

    // FALLBACK: If HTML is still 0 because of chunked transfer headers, read the text buffer size
    if (breakdownBytes.html === 0 && mainResponse) {
      try {
        const htmlContent = await mainResponse.text()
        const fallbackHtmlBytes = Buffer.byteLength(htmlContent, 'utf8')

        breakdownBytes.html = fallbackHtmlBytes
        totalBytes += fallbackHtmlBytes
      } catch (e) {
        console.warn('Fallback HTML reading skipped')
      }
    }

    // 6. Calculate CO2 emissions using the 1byte model
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

    // 7. Return values
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
    // 8. Safely close browser session
    if (browser) {
      await browser.close()
    }
  }
})
