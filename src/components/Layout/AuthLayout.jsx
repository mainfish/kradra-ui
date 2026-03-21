import { useEffect, useRef } from 'react'
import Panel from '../../shared/ui/Panel'

export default function AuthLayout({ children, onRequestClose }) {
  const closeBtnRef = useRef(null)

  useEffect(() => {
    const prevActive = document.activeElement
    closeBtnRef.current?.focus?.()

    function onKeyDown(e) {
      if (e.key === 'Escape') {
        e.preventDefault()
        onRequestClose?.()
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      prevActive?.focus?.()
    }
  }, [onRequestClose])

  return (
    <div className="fixed inset-0 z-50" role="presentation">
      {/* backdrop: клик вне формы закрывает */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        role="presentation"
        onPointerDown={() => onRequestClose?.()}
      />

      <div className="absolute inset-0 flex items-center justify-center p-6">
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Authentication"
          className="w-full max-w-md"
          onPointerDown={(e) => e.stopPropagation()}
        >
          <Panel className="relative p-8">
            <button
              ref={closeBtnRef}
              type="button"
              onClick={() => onRequestClose?.()}
              aria-label="Close"
              title="Close"
              className="absolute right-3 top-3 inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/80 backdrop-blur-md transition hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/20"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
                <path
                  d="M6 6l12 12M18 6L6 18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>

            {children}
          </Panel>
        </div>
      </div>
    </div>
  )
}