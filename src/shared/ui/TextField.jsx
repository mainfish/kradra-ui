export default function TextField({
    label,
    value,
    onChange,
    placeholder,
    type = 'text',
    autoComplete,
    className = '',
}) {
    return (
        <div className="space-y-3">
            {label ? (
                <label className="block text-sm font-medium text-white/70">{label}</label>
            ) : null}
            <input
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                type={type}
                autoComplete={autoComplete}
                className={
                    'w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none ' +
                    'placeholder:text-white/30 focus:border-white/20 focus:ring-2 focus:ring-white/10 ' +
                    className
                }
            />
        </div>
    )
}