'use client'

import { useEffect, useState } from 'react'
import { trackVWOConversion, trackVWOEvent, setVWOAttributes, getVWOVariation } from '@/lib/vwo'

/**
 * Hook to use VWO in React components
 * 
 * @example
 * const { trackConversion, trackEvent, getVariation } = useVWO()
 * 
 * // Track a conversion
 * trackConversion('12345')
 * 
 * // Track a custom event
 * trackEvent('run_signup', { pace: 'easy' })
 * 
 * // Check experiment variation
 * const variation = getVariation('experiment_123')
 */
export function useVWO() {
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    // Wait for VWO SmartCode to load
    const checkVWO = () => {
      if (typeof window !== 'undefined' && window.VWO) {
        setIsReady(true)
      }
    }

    // Check immediately in case it's already loaded
    checkVWO()

    // Also set up an interval to check periodically (for first 5 seconds)
    const interval = setInterval(checkVWO, 100)
    const timeout = setTimeout(() => clearInterval(interval), 5000)

    return () => {
      clearInterval(interval)
      clearTimeout(timeout)
    }
  }, [])

  return {
    isReady,
    trackConversion: trackVWOConversion,
    trackEvent: trackVWOEvent,
    setAttributes: setVWOAttributes,
    getVariation,
  }
}

/**
 * Hook to conditionally render content based on VWO experiment variation
 * 
 * @example
 * const { variation, isLoading } = useVWOVariation('experiment_123')
 * 
 * if (isLoading) return <div>Loading...</div>
 * 
 * if (variation === 'variation_1') {
 *   return <div>Version A</div>
 * }
 * 
 * return <div>Control/Default Version</div>
 */
export function useVWOVariation(experimentId: string | number) {
  const [variation, setVariation] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkVariation = () => {
      if (typeof window !== 'undefined' && window.VWO) {
        const v = getVWOVariation(experimentId)
        setVariation(v)
        setIsLoading(false)
      }
    }

    // Check immediately
    checkVariation()

    // Also check after a short delay to allow VWO to initialize
    const timeout = setTimeout(checkVariation, 500)

    return () => clearTimeout(timeout)
  }, [experimentId])

  return {
    variation,
    isLoading,
  }
}
