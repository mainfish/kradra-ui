import StarfieldBackground from '../Background/StarfieldBackground'

// AuthLayout renders a centered auth card.
// If `onRequestClose` is provided, clicking the backdrop closes it.
export default function AuthLayout({ children, onRequestClose }) {
  return (
    <div
      className="relative min-h-screen overflow-x-hidden overflow-y-auto bg-[#05070b]"
      onClick={() => {
        if (typeof onRequestClose === 'function') onRequestClose()
      }}
      role="presentation"
    >
      <StarfieldBackground />

      <div className="relative z-10 flex min-h-screen items-center justify-center p-6">
        <div
          className="w-full max-w-md rounded-2xl border border-white/10 bg-slate-950/56 p-8 shadow-2xl backdrop-blur-md"
          onClick={(e) => e.stopPropagation()} // важно: клик внутри НЕ закрывает
          role="presentation"
        >
          {children}
        </div>
      </div>
    </div>
  )
}
