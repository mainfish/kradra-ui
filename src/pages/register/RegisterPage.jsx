import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import Button from '../../shared/ui/Button'
import TextField from '../../shared/ui/TextField'

export default function RegisterPage() {
    const navigate = useNavigate()
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    return (
        <div className="space-y-6">
            <div className="text-center">
                <h1 className="text-3xl font-semibold tracking-tight text-white">Create account</h1>
                <p className="mt-2 text-sm text-white/60">
                    Registration UI placeholder. Backend wiring next.
                </p>
            </div>

            <form
                className="space-y-4"
                onSubmit={(e) => {
                    e.preventDefault()
                    alert('Registration is not wired yet.')
                }}
            >
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
                    placeholder="password"
                    type="password"
                    autoComplete="new-password"
                />

                <Button variant="primary" type="submit" className="w-full py-3">
                    Register
                </Button>
            </form>

            <div className="text-center text-sm text-white/60">
                Already have an account?{' '}
                <button
                    type="button"
                    className="text-white underline underline-offset-4"
                    onClick={() => navigate('/login')}
                >
                    Log in
                </button>
            </div>
        </div>
    )
}