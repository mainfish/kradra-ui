import { useState } from 'react'

import Button from '../../../shared/ui/Button'
import TextField from '../../../shared/ui/TextField'
import { loginAction } from '../actions/loginAction'

export default function LoginForm() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  async function onSubmit(e) {
    e.preventDefault()

    setError('')
    setSuccess('')

    const u = String(username || '').trim()
    const p = String(password || '')

    if (!u || !p) {
      setError('Please enter username and password.')
      return
    }

    setIsSubmitting(true)

    const res = await loginAction({ username: u, password: p })

    if (res?.ok) {
      setSuccess(res.message || 'Login successful.')
      // IMPORTANT: do NOT navigate here.
      // App.jsx handles the delayed redirect (1s) so the success message stays visible.
    } else {
      setError(res?.message || 'Login failed.')
    }

    setIsSubmitting(false)
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-semibold tracking-tight text-white">Log in</h1>
        <p className="mt-2 text-sm text-white/60">Use your account to continue.</p>
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
          placeholder="password"
          type="password"
          autoComplete="current-password"
        />

        <Button variant="primary" type="submit" className="w-full py-3" disabled={isSubmitting}>
          {isSubmitting ? 'Signing in…' : 'Log in'}
        </Button>
      </form>

      <div className="text-center text-sm text-white/60">
        No account yet?{' '}
        <a className="text-white underline underline-offset-4" href="/register">
          Register
        </a>
      </div>
    </div>
  )
}