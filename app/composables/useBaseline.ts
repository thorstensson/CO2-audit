import { co2 } from '@tgwf/co2'

/**
 * HTTP Archive Web Almanac 2024 median page weights:
 * - Desktop: 2,862 KB
 * - Mobile:  2,559 KB
 */
const DESKTOP_BASELINE_BYTES = 2862 * 1024
const MOBILE_BASELINE_BYTES = 2559 * 1024

export const useBaseline = () => {
  const model = new co2({ model: '1byte' })

  /**
   * Convert bytes to CO₂ grams using the same 1byte model as the scan API.
   */
  function perByte(bytes: number): number {
    const result = model.perByte(bytes)
    if (result && typeof result === 'object' && 'total' in result) {
      return typeof result.total === 'string'
        ? parseFloat(result.total)
        : result.total
    }
    return typeof result === 'string'
      ? parseFloat(result)
      : (result as number) || 0
  }

  /**
   * Returns the baseline CO₂ for an average page in the given mode.
   */
  function getBaselineCO2(isMobile = false): number {
    const bytes = isMobile ? MOBILE_BASELINE_BYTES : DESKTOP_BASELINE_BYTES
    return parseFloat(perByte(bytes).toFixed(4))
  }

  /**
   * Calculate how many grams of CO₂ were saved compared to the baseline.
   * Returns a formatted string like "0.1234g".
   */
  function calculateSaved(actualCo2Grams: number, isMobile = false): string {
    const baseline = getBaselineCO2(isMobile)
    const saved = baseline - actualCo2Grams
    return `${parseFloat(saved.toFixed(4))}g`
  }

  return { calculateSaved, getBaselineCO2 }
}
