import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function RegisterPage() {
    const navigate = useNavigate()
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    return (
        <div className="space-y-6">
            <div className="text-center">
                <h1 className="text-3xl font-semibold tracking-tight text-white">Create account</h1>
                <p className="mt-2 text-sm text-white/60">Registration UI placeholder. Backend wiring next.</p>
            </div>

            <form
                className="space-y-4"
                onSubmit={(e) => {
                    e.preventDefault()
                    alert('Registration is not wired yet.')
                }}
            >
                <div className="space-y-2">
                    <label className="text-sm text-white/70">Username</label>
                    <input
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-white/30 focus:border-white/20 focus:ring-2 focus:ring-white/10"
                        placeholder="username"
                        autoComplete="username"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm text-white/70">Password</label>
                    <input
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        type="password"
                        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-white/30 focus:border-white/20 focus:ring-2 focus:ring-white/10"
                        placeholder="password"
                        autoComplete="new-password"
                    />
                </div>

                <button
                    type="submit"
                    className="w-full rounded-xl bg-white px-4 py-3 font-semibold text-black transition hover:bg-white/90"
                >
                    Register
                </button>
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