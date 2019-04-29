import React from 'react'

/**
 * Get a display name for a component
 */
export default function getDisplayName<P>(Component: React.ComponentType<P>) {
  return Component.displayName || Component.name || 'Component'
}
