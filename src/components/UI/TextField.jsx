export default function TextField({
  id,
  label,
  type = 'text',
  name,
  placeholder,
  autoComplete,
  value,
  onChange,
  disabled = false,
  error,
}) {
  const describedBy = error ? `${id}-error` : undefined

  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-sm text-white/72">
        {label}
      </label>

      <input
        id={id}
        name={name}
        type={type}
        placeholder={placeholder}
        autoComplete={autoComplete}
        value={value}
        onChange={onChange}
        disabled={disabled}
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy}
        className="w-full rounded-xl border border-white/12 bg-white/6 px-4 py-3 text-white outline-none transition placeholder:text-white/28 focus:border-slate-300/40 focus:ring-4 focus:ring-white/8 disabled:cursor-not-allowed disabled:opacity-60"
      />

      {error && (
        <p id={describedBy} className="text-xs text-red-200">
          {error}
        </p>
      )}
    </div>
  )
}
