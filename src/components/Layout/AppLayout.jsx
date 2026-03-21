import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import StarfieldBackground from '../Background/StarfieldBackground'
import { clearAuthSession } from '../../lib/storage'
import Panel from '../../shared/ui/Panel'

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

function MenuButton({ onClick, danger = false, children }) {
    return (
        <button
            type="button"
            role="menuitem"
            onClick={onClick}
            className={
                'w-full text-left px-3 py-2 text-sm rounded-lg transition ' +
                (danger
                    ? 'text-red-200 hover:bg-red-500/10'
                    : 'text-white/80 hover:bg-white/5 hover:text-white')
            }
        >
            {children}
        </button>
    )
}

function UserMenu({ user, onClose, onSignOut }) {
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
                    onClick={() => {
                        onClose()
                        onSignOut()
                    }}
                >
                    Sign out
                </MenuButton>
            </div>
        </div>
    )
}

function UserAvatarButton({ user, isOpen, onToggle }) {
    const initial = (user?.username || '?').slice(0, 1).toUpperCase()

    return (
        <button
            type="button"
            onClick={onToggle}
            aria-haspopup="menu"
            aria-expanded={isOpen}
            className={
                'h-10 w-10 rounded-xl border border-white/10 bg-white/5 backdrop-blur-md grid place-items-center ' +
                'text-white/90 font-semibold transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/20'
            }
            title={user?.username || 'Account'}
        >
            {initial}
        </button>
    )
}

export default function AppLayout({ user, children }) {
    const navigate = useNavigate()

    const [open, setOpen] = useState(false)
    const menuRef = useRef(null)

    function closeMenu() {
        setOpen(false)
    }

    function handleSignOut() {
        // Central place for logout side-effects in this layout.
        clearAuthSession()
        navigate('/', { replace: true })
    }

    useEffect(() => {
        function onKeyDown(e) {
            if (e.key === 'Escape') setOpen(false)
        }

        function onPointerDown(e) {
            const el = menuRef.current
            if (!el) return
            if (!el.contains(e.target)) setOpen(false)
        }

        window.addEventListener('keydown', onKeyDown)
        window.addEventListener('pointerdown', onPointerDown)
        return () => {
            window.removeEventListener('keydown', onKeyDown)
            window.removeEventListener('pointerdown', onPointerDown)
        }
    }, [])

    return (
        <div className="relative min-h-screen overflow-x-hidden overflow-y-auto bg-[#05070b]">
            <StarfieldBackground />

            <div className="fixed top-6 right-6 z-40">
                <div className="relative" ref={menuRef}>
                    <UserAvatarButton user={user} isOpen={open} onToggle={() => setOpen((v) => !v)} />
                    {open ? <UserMenu user={user} onClose={closeMenu} onSignOut={handleSignOut} /> : null}
                </div>
            </div>

            <div className="relative z-10 mx-auto max-w-5xl px-6 pt-24 pb-10">
                <Panel className="p-8">{children}</Panel>
            </div>
        </div>
    )
}