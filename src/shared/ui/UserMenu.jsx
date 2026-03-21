import { Link } from 'react-router-dom'

function Spinner() {
    return (
        <svg
            className="h-4 w-4 animate-spin"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
        >
            <circle
                className="opacity-20"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
            />
            <path
                className="opacity-90"
                d="M22 12a10 10 0 0 1-10 10"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
            />
        </svg>
    )
}

function MenuLink({ to, onClose, children }) {
    return (
        <Link
            to={to}
            role="menuitem"
            onClick={onClose}
            className="block w-full px-3 py-2 text-sm rounded-lg transition text-white/80 hover:bg-white/5 hover:text-white"
        >
            {children}
        </Link>
    )
}

function MenuButton({ onClick, danger = false, disabled = false, children }) {
    return (
        <button
            type="button"
            role="menuitem"
            onClick={disabled ? undefined : onClick}
            disabled={disabled}
            className={
                'w-full text-left px-3 py-2 text-sm rounded-lg transition flex items-center justify-between ' +
                (danger
                    ? 'text-red-200 hover:bg-red-500/10'
                    : 'text-white/80 hover:bg-white/5 hover:text-white') +
                (disabled ? ' opacity-60 pointer-events-none' : '')
            }
        >
            {children}
        </button>
    )
}

export default function UserMenu({ user, onClose, onSignOut, isSigningOut = false }) {
    const isAdmin = user?.role === 'admin'

    return (
        <div
            role="menu"
            className="absolute right-0 mt-3 w-72 z-50 rounded-2xl border border-white/10 bg-slate-950/90 shadow-2xl backdrop-blur-md overflow-hidden"
        >
            <div className="px-4 py-3">
                <div className="text-white font-semibold leading-tight">{user?.username || 'unknown'}</div>
                <div className="text-white/50 text-sm">{user?.role || ''}</div>
            </div>

            <div className="h-px bg-white/10" />

            <div className="p-2">
                <MenuLink to="/profile" onClose={onClose}>
                    Profile
                </MenuLink>
                <MenuLink to="/settings" onClose={onClose}>
                    Settings
                </MenuLink>
                {isAdmin ? (
                    <MenuLink to="/admin" onClose={onClose}>
                        Admin panel
                    </MenuLink>
                ) : null}
            </div>

            <div className="h-px bg-white/10" />

            <div className="p-2">
                <MenuButton
                    danger
                    disabled={isSigningOut}
                    onClick={() => {
                        onClose()
                        onSignOut()
                    }}
                >
                    <span>{isSigningOut ? 'Signing out…' : 'Sign out'}</span>
                    {isSigningOut ? <Spinner /> : null}
                </MenuButton>
            </div>
        </div>
    )
}