import { ComponentType } from 'react'

/**
 * Get a display name for a component
 */
export default function getDisplayName<P>(Component: ComponentType<P>): string {
  return Component.displayName || Component.name || 'Component'
}
