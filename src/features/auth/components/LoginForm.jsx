import TextField from '../../../components/UI/TextField'
import PrimaryButton from '../../../components/UI/PrimaryButton'
import { useLoginForm } from '../model/useLoginForm'

function MiniFractalIcon() {
  return (
    <div className="mx-auto mb-4 h-14 w-14 rounded-xl border border-white/10 bg-black/30 p-2 shadow-xl">
      <svg viewBox="0 0 64 64" className="h-full w-full" aria-hidden="true">
        <defs>
          <linearGradient id="miniSilver" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f3f4f6" />
            <stop offset="35%" stopColor="#8b95a7" />
            <stop offset="70%" stopColor="#d6dae2" />
            <stop offset="100%" stopColor="#5a6474" />
          </linearGradient>
          <linearGradient id="miniAccent" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(96,165,250,0.8)" />
            <stop offset="50%" stopColor="rgba(168,85,247,0.55)" />
            <stop offset="100%" stopColor="rgba(217,119,6,0.45)" />
          </linearGradient>
        </defs>

        <circle cx="32" cy="32" r="22" fill="rgba(255,255,255,0.05)" />
        <path
          d="M 32 8
             C 44 10, 52 19, 50 28
             C 47 39, 34 42, 27 44
             C 17 47, 10 41, 9 31
             C 8 18, 18 10, 31 9"
          fill="none"
          stroke="url(#miniSilver)"
          strokeWidth="4.5"
          strokeLinecap="round"
        />
        <path
          d="M 32 14
             C 40 16, 45 22, 43 29
             C 41 35, 33 38, 27 39
             C 19 41, 14 36, 14 29
             C 14 20, 21 15, 31 14"
          fill="none"
          stroke="url(#miniAccent)"
          strokeWidth="2.5"
          strokeLinecap="round"
          opacity="0.85"
        />
        <circle cx="21" cy="21" r="2.3" fill="#dbe1ea" />
        <circle cx="43" cy="23" r="2" fill="#9ec5ff" />
        <circle cx="28" cy="40" r="1.8" fill="#c79cff" />
      </svg>
    </div>
  )
}

function LoadingSpinner() {
  return (
    <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-500 border-t-transparent" />
  )
}

function openForgotPassword() {
  alert('Placeholder: password recovery is not connected yet.')
}

export default function LoginForm() {
  const { state, errors, isTouched, onChange, onSubmit } = useLoginForm()

  const {
    fields: { username, password, remember },
    message,
    isSuccess,
    isLoading,
  } = state

  return (
    <div className="space-y-6">
      <div className="text-center">
        <MiniFractalIcon />
        <h1 className="text-3xl font-semibold tracking-tight text-white">
          Kradra Portal
        </h1>
        <p className="mt-2 text-sm text-white/68">Secure sign in</p>
      </div>

      <form className="space-y-4" onSubmit={onSubmit}>
        <TextField
          id="username"
          name="username"
          label="Username"
          placeholder="Enter your username"
          autoComplete="username"
          value={username}
          onChange={onChange('username')}
          disabled={isLoading}
          error={isTouched ? errors.username : undefined}
        />

        <TextField
          id="password"
          name="password"
          type="password"
          label="Password"
          placeholder="Enter your password"
          autoComplete="current-password"
          value={password}
          onChange={onChange('password')}
          disabled={isLoading}
          error={isTouched ? errors.password : undefined}
        />

        <div className="flex items-center justify-between gap-3 text-sm text-white/68">
          <label className="inline-flex items-center gap-2">
            <input
              type="checkbox"
              checked={remember}
              onChange={onChange('remember')}
              className="accent-slate-300"
              disabled={isLoading}
            />
            <span>Remember me</span>
          </label>

          <button
            type="button"
            onClick={openForgotPassword}
            className="text-slate-300 hover:text-white disabled:opacity-50"
            disabled={isLoading}
          >
            Forgot password?
          </button>
        </div>

        <PrimaryButton type="submit" disabled={isLoading}>
          <span className="inline-flex items-center gap-2">
            {isLoading && <LoadingSpinner />}
            <span>{isLoading ? 'Signing in...' : 'Sign in'}</span>
          </span>
        </PrimaryButton>
      </form>

      {message && (
        <div
          className={`rounded-xl px-4 py-3 text-sm ${
            isSuccess
              ? 'border border-emerald-400/30 bg-emerald-500/10 text-emerald-200'
              : 'border border-red-400/30 bg-red-500/10 text-red-200'
          }`}
        >
          {message}
        </div>
      )}
    </div>
  )
}
