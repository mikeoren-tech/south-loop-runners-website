/**
 * VWO A/B Testing Utilities
 * 
 * This module provides utilities for tracking conversions and custom events in VWO experiments.
 * VWO SmartCode is automatically loaded in the app layout.
 */

/**
 * Track a conversion event in VWO
 * @param goalId - The VWO goal ID to track
 * @param value - Optional revenue value for revenue goals
 * 
 * @example
 * trackVWOConversion('12345')
 * trackVWOConversion('12345', 99.99)
 */
export function trackVWOConversion(goalId: string | number, value?: number) {
  if (typeof window === 'undefined') return

  try {
    if (window.VWO && window.VWO.event) {
      const eventData: any = {
        goal_id: goalId,
      }

      if (value !== undefined) {
        eventData.revenue_value = value
      }

      window.VWO.event(eventData)
    }
  } catch (error) {
    console.error('[VWO] Error tracking conversion:', error)
  }
}

/**
 * Track a custom event in VWO
 * @param eventName - Custom event name
 * @param eventData - Optional event data object
 * 
 * @example
 * trackVWOEvent('run_signup', { pace: 'easy' })
 * trackVWOEvent('race_registration')
 */
export function trackVWOEvent(eventName: string, eventData?: Record<string, any>) {
  if (typeof window === 'undefined') return

  try {
    if (window.VWO && window.VWO.event) {
      window.VWO.event({
        event_name: eventName,
        ...eventData,
      })
    }
  } catch (error) {
    console.error('[VWO] Error tracking event:', error)
  }
}

/**
 * Set custom attributes for the visitor
 * @param attributes - Object with visitor attributes
 * 
 * @example
 * setVWOAttributes({ 'user_type': 'premium', 'registration_date': '2024-01-15' })
 */
export function setVWOAttributes(attributes: Record<string, any>) {
  if (typeof window === 'undefined') return

  try {
    if (window.VWO && window.VWO.visitor && window.VWO.visitor.attribute) {
      Object.entries(attributes).forEach(([key, value]) => {
        window.VWO.visitor.attribute(key, value)
      })
    }
  } catch (error) {
    console.error('[VWO] Error setting attributes:', error)
  }
}

/**
 * Check if a specific experiment is active and get the variation
 * @param experimentId - VWO experiment ID
 * @returns The variation name/ID if active, null otherwise
 * 
 * @example
 * const variation = getVWOVariation('12345')
 * if (variation === 'variation_1') {
 *   // Show variation A
 * }
 */
export function getVWOVariation(experimentId: string | number): string | null {
  if (typeof window === 'undefined') return null

  try {
    if (window.VWO && window.VWO.variationName) {
      return window.VWO.variationName(experimentId)
    }
  } catch (error) {
    console.error('[VWO] Error getting variation:', error)
  }

  return null
}

declare global {
  interface Window {
    VWO?: any
  }
}
