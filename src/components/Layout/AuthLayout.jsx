import StarfieldBackground from '../Background/StarfieldBackground'

export default function AuthLayout({ children }) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#05070b]">
      <StarfieldBackground />

      <div className="relative z-10 flex min-h-screen items-center justify-center p-6">
        <div className="w-full max-w-md rounded-2xl border border-white/10 bg-slate-950/56 p-8 shadow-2xl backdrop-blur-md">
          {children}
        </div>
      </div>
    </div>
  )
}
