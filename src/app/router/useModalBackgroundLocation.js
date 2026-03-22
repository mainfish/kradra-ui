import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'

// Keeps a stable background location for modal routes:
// - On first modal open, captures location.state.backgroundLocation
// - Preserves it when navigating between modal routes (/login <-> /register)
// - Resets when leaving modal routes
export function useModalBackgroundLocation(isModalRoute) {
    const location = useLocation()

    const bgFromState = location.state?.backgroundLocation || null
    const bgRef = useRef(bgFromState)

    // capture synchronously on first render (important for first modal open)
    if (isModalRoute && bgFromState && !bgRef.current) {
        bgRef.current = bgFromState
    }

    // reset when leaving modal routes
    useEffect(() => {
        if (!isModalRoute) bgRef.current = null
    }, [isModalRoute])

    return bgRef.current
}