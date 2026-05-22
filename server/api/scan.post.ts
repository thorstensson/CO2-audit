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

  const isProd = process.env.NODE_ENV === 'production'
  let browser: any
  let cdpSession: any
  const requestTypes = new Map()

  try {
    if (isProd) {
      const browserlessEndpoint = `wss://chrome.browserless.io?token=${process.env.BROWSERLESS_TOKEN}&--use-gl=angle&--use-angle=gl`
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

    // ========================================================================
    // PRODUCTION FOOTPRINT: Mask Headless Signatures
    // Bypasses corporate cloud-infrastructure firewalls that block raw Browserless IPs
    // ========================================================================
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    )
    await page.setViewport({ width: 1440, height: 900 })
    // ========================================================================

    // Setup initial data buckets
    const breakdownBytes = {
      html: 0,
      css: 0,
      javascript: 0,
      images: 0,
      fonts: 0,
      other: 0,
    }
    let totalBytes = 0

    // 1. Open up Chrome DevTools Protocol Session
    cdpSession = await page.target().createCDPSession()
    await cdpSession.send('Network.enable')

    // 2. Track types natively using Chrome's internal CDP response keys to prevent race conditions
    cdpSession.on('Network.responseReceived', (event: any) => {
      console.log('Network.responseReceived')
      const resourceType = (event.type || 'other').toLowerCase()
      requestTypes.set(event.requestId, resourceType)
    })

    // 3. Tally accurate compressed wire-bytes on complete loads using the synced IDs
    cdpSession.on('Network.loadingFinished', (event: any) => {
      console.log('Network.loadingFinished')
      const type = requestTypes.get(event.requestId) || 'other'
      const wireBytes = event.encodedDataLength || 0

      totalBytes += wireBytes

      if (type === 'document') breakdownBytes.html += wireBytes
      else if (type === 'stylesheet') breakdownBytes.css += wireBytes
      else if (type === 'script') breakdownBytes.javascript += wireBytes
      else if (type === 'image' || type === 'media')
        breakdownBytes.images += wireBytes
      else if (type === 'font') breakdownBytes.fonts += wireBytes
      // Catches all 3D assets, textures, and mesh coordinate data requested by Three.js
      else if (type === 'fetch' || type === 'xhr')
        breakdownBytes.other += wireBytes
      else breakdownBytes.other += wireBytes
    })

    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 })
    console.log(
      'Primary DOM Loaded. Holding window open for WebGL texture streaming...'
    )

    // FORCE A 3-SECOND ASYNC WAIT TO CAPTURE FETCH/XHR ASSETS:
    await new Promise((resolve) => setTimeout(resolve, 3000))
    console.log(
      `Pipeline Sync Complete. Captured true WebGL compressed wire bytes: ${totalBytes}`
    )

    // ========================================================================
    // CRITICAL FIX: Enhanced Asynchronous CDP Event Settle Delay
    // Extended to 500ms to completely prevent localhost background thread race
    // conditions, giving all trailing asset logs time to flush out.
    // ========================================================================
    await new Promise((resolve) => setTimeout(resolve, 500))
    console.log(
      `CDP Event Buffers Flushed. Total wire bytes compiled: ${totalBytes}`
    )
    // ========================================================================

    // 4. Instantiate Sustainable Web Design Model (v4 defaults via 'swd')
    const swdmModel = new co2({ model: 'swd' })
    const co2GramsResult = swdmModel.perByte(totalBytes)

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

    // ========================================================================
    // 5. Refactored Formatting Helpers (Supports clean MB scaling and KB defaults)
    // ========================================================================
    const formatBytes = (bytes: number): string => {
      if (bytes === 0) return '0 KB'
      const k = 1024
      const sizes = ['Bytes', 'KB', 'MB']
      const i = Math.floor(Math.log(bytes) / Math.log(k))

      // If resource tracks under 1 KB, enforce clean fractional KB sizing instead of bytes
      if (i === 0) return `${(bytes / k).toFixed(2)} KB`

      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    }

    const getPercentage = (categoryBytes: number): string => {
      if (totalBytes === 0) return '0%'
      const percentage = (categoryBytes / totalBytes) * 100
      // If it is greater than zero but under 0.1%, display <0.1% to avoid broken layout/0% readings
      if (percentage > 0 && percentage < 0.1) return '<0.1%'
      return `${parseFloat(percentage.toFixed(1))}%`
    }

    const uiBreakdown = {
      html: {
        size: formatBytes(breakdownBytes.html),
        share: getPercentage(breakdownBytes.html),
      },
      css: {
        size: formatBytes(breakdownBytes.css),
        share: getPercentage(breakdownBytes.css),
      },
      javascript: {
        size: formatBytes(breakdownBytes.javascript),
        share: getPercentage(breakdownBytes.javascript),
      },
      images: {
        size: formatBytes(breakdownBytes.images),
        share: getPercentage(breakdownBytes.images),
      },
      fonts: {
        size: formatBytes(breakdownBytes.fonts),
        share: getPercentage(breakdownBytes.fonts),
      },
      other: {
        size: formatBytes(breakdownBytes.other),
        share: getPercentage(breakdownBytes.other),
      },
    }

    // 6. Map Sustainability Index Grade Symbol based on strict SWDM v4 thresholds
    let sustainabilityIndex = 'F'
    if (finalCo2Grams <= 0.18) sustainabilityIndex = 'A+'
    else if (finalCo2Grams <= 0.26) sustainabilityIndex = 'A'
    else if (finalCo2Grams <= 0.46) sustainabilityIndex = 'B'
    else if (finalCo2Grams <= 0.63) sustainabilityIndex = 'C'
    else if (finalCo2Grams <= 0.85) sustainabilityIndex = 'D'

    return {
      url,
      co2Grams: parseFloat(finalCo2Grams.toFixed(4)),
      sustainabilityIndex,
      breakdown: uiBreakdown,
      lighthouseFakeRun: 1,
    }
  } catch (error: any) {
    console.error('====== SCAN ENDPOINT CRASHED ======')
    console.error(error)
    throw createError({ statusCode: 500, statusMessage: error.message })
  } finally {
    // Clear references out of memory explicitly
    requestTypes.clear()

    if (cdpSession) {
      try {
        await cdpSession.detach()
      } catch (detachError) {
        console.error('Error detaching CDP Session:', detachError)
      }
    }
    if (browser) {
      await browser.close()
    }
  }
})
