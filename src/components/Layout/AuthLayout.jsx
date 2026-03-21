import StarfieldBackground from '../Background/StarfieldBackground'
import Panel from '../../shared/ui/Panel'

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
        <Panel className="w-full max-w-md p-8">
          <div onClick={(e) => e.stopPropagation()} role="presentation">
            {children}
          </div>
        </Panel>
      </div>
    </div>
  )
}