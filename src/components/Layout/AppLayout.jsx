import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import StarfieldBackground from '../Background/StarfieldBackground'
import Panel from '../../shared/ui/Panel'
import UserMenu from '../../shared/ui/UserMenu'
import { logout } from '../../app/auth/logout'

function delay(ms) {
    return new Promise((r) => setTimeout(r, ms))
}

function UserAvatarButton({ user, isOpen, onToggle, disabled = false }) {
    const initial = (user?.username || '?').slice(0, 1).toUpperCase()

    return (
        <button
            type="button"
            onClick={disabled ? undefined : onToggle}
            aria-haspopup="menu"
            aria-expanded={isOpen}
            disabled={disabled}
            className={
                'h-10 w-10 rounded-xl border border-white/10 bg-white/5 backdrop-blur-md grid place-items-center ' +
                'text-white/90 font-semibold transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/20 ' +
                (disabled ? 'opacity-60 pointer-events-none' : '')
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
    const [isSigningOut, setIsSigningOut] = useState(false)
    const menuRef = useRef(null)

    function closeMenu() {
        setOpen(false)
    }

    async function handleSignOut() {
        if (isSigningOut) return

        setIsSigningOut(true)

        try {
            // UX: чуть-чуть подержать спиннер, чтобы действие не “мигнуло” слишком быстро
            await Promise.all([logout(), delay(300)])
        } finally {
            // даже если logout упал, logout() уже сделал clearAuthSession() в finally
            setIsSigningOut(false)
            navigate('/', { replace: true })
        }
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
                    <UserAvatarButton
                        user={user}
                        isOpen={open}
                        disabled={isSigningOut}
                        onToggle={() => setOpen((v) => !v)}
                    />
                    {open ? (
                        <UserMenu
                            user={user}
                            onClose={closeMenu}
                            onSignOut={handleSignOut}
                            isSigningOut={isSigningOut}
                        />
                    ) : null}
                </div>
            </div>

            <div className="relative z-10 mx-auto max-w-5xl px-6 pt-24 pb-10">
                <Panel className="p-8">{children}</Panel>
            </div>
        </div>
    )
}