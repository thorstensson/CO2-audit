import puppeteer from 'puppeteer'
import { co2 } from '@tgwf/co2'

export default defineEventHandler(async (event) => {
  // 1. Get the URL and Turnstile verification token from the client payload
  const body = await readBody(event)
  const { token } = body
  let url = body.url

  if (!url) {
    throw createError({ statusCode: 400, statusMessage: 'URL is required' })
  }

  // Instantly block direct API script requests that skip the frontend widget
  if (!token) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Human verification token is missing',
    })
  }

  // URL Normalizer: Automatically prepends https:// if the guest omitted it
  if (!/^https?:\/\//i.test(url)) {
    url = `https://${url}`
  }

  // 2. Validate the token with Cloudflare using Nuxt's official module helper
  const verification = await verifyTurnstileToken(token)
  if (!verification.success) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Verification failed. Bots are not allowed.',
    })
  }

  // 3. Smart Browser Connection: Use Browserless in production, local Chrome in development
  const isProd = process.env.NODE_ENV === 'production'
  let browser

  try {
    if (isProd) {
      browser = await puppeteer.connect({
        browserWSEndpoint: `wss://chrome.browserless.io?token=${process.env.BROWSERLESS_TOKEN}`,
      })
    } else {
      browser = await puppeteer.launch({
        headless: true,
        channel: 'chrome', // Forces Puppeteer to launch your local system's Google Chrome
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
      // Only count successful or cached resource resolutions (ignore breaks/redirects)
      if (status >= 200 && status < 400) {
        const headers = response.headers()
        const contentLength = headers['content-length']

        if (contentLength) {
          const bytes = parseInt(contentLength, 10)
          totalBytes += bytes

          // Extract Puppeteer's resource categorization string
          const resourceType = response.request().resourceType()

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
      }
    })

    // 5. Navigate to the website and wait until network traffic quiets down
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 })

    // 6. Calculate CO2 emissions using the 1byte model
    const co2Emission = new co2({ model: '1byte' })
    const co2GramsResult = co2Emission.perByte(totalBytes)

    let finalCo2Grams = 0

    // Explicitly handle whether co2.js returned an object or a primitive number
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

    // 7. Return raw values safely to the guest user along with the new breakdown tracking
    return {
      url,
      co2Grams: parseFloat(finalCo2Grams.toFixed(4)),
      breakdownBytes, // Feeds your Vue frontend computed property perfectly!
      lighthouseFakeRun: 1,
    }
  } catch (error: any) {
    // Crucial: This prints the exact descriptive stack trace to your terminal!
    console.error('====== SCAN ENDPOINT CRASHED ======')
    console.error(error)
    console.error('====================================')
    throw createError({ statusCode: 500, statusMessage: error.message })
  } finally {
    // 8. Safely close the browser session whether execution succeeded or failed
    if (browser) {
      await browser.close()
    }
  }
})
