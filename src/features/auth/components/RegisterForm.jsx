import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import Button from '../../../shared/ui/Button'
import LinkButton from '../../../shared/ui/LinkButton'
import TextField from '../../../shared/ui/TextField'
import { registerAction } from '../actions/registerAction'
import { AUTH_REDIRECT_DELAY_MS, ROUTES } from '../../../app/router/constants'

export default function RegisterForm() {
    const navigate = useNavigate()
    const location = useLocation()

    // Preserve modal background when switching between /login <-> /register.
    const bg = location.state?.backgroundLocation
    const modalState = bg ? { backgroundLocation: bg } : undefined

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    // After successful register+login, go to home after the same configured delay
    useEffect(() => {
        if (!success) return
        const t = window.setTimeout(() => {
            navigate(ROUTES.ROOT, { replace: true })
        }, AUTH_REDIRECT_DELAY_MS)
        return () => window.clearTimeout(t)
    }, [success, navigate])

    async function onSubmit(e) {
        e.preventDefault()
        setError('')
        setSuccess('')

        setIsSubmitting(true)
        const res = await registerAction({ username, password })
        setIsSubmitting(false)

        if (!res.ok) {
            setError(res.message || 'Registration failed.')
            return
        }

        setSuccess('Account created. Signing you in…')
    }

    return (
        <div className="space-y-6">
            <div className="text-center">
                <h1 className="text-3xl font-semibold tracking-tight text-white">Create account</h1>
                <p className="mt-2 text-sm text-white/60">Create your account to continue.</p>
            </div>

            {success ? (
                <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
                    {success}
                </div>
            ) : null}

            {error ? (
                <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                    {error}
                </div>
            ) : null}

            <form className="space-y-4" onSubmit={onSubmit}>
                <TextField
                    label="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="username"
                    autoComplete="username"
                />

                <TextField
                    label="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="password (min 8 chars)"
                    type="password"
                    autoComplete="new-password"
                />

                <Button variant="primary" type="submit" className="w-full py-3" disabled={isSubmitting}>
                    {isSubmitting ? 'Creating…' : 'Register'}
                </Button>
            </form>

            <div className="text-center text-sm text-white/60">
                Already have an account?{' '}
                <LinkButton to={ROUTES.LOGIN} state={modalState}>
                    Log in
                </LinkButton>
            </div>
        </div>
    )
}