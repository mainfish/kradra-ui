export default function Button({
    variant = 'primary', // 'primary' | 'ghost'
    className = '',
    type = 'button',
    onClick,
    children,
    ...rest
}) {
    const base =
        'rounded-xl px-4 py-2 text-sm font-semibold transition focus:outline-none focus:ring-2 '

    const styles =
        variant === 'primary'
            ? 'bg-white text-black hover:bg-white/90 focus:ring-white/30'
            : 'border border-white/10 bg-white/5 text-white/90 backdrop-blur-md hover:bg-white/10 focus:ring-white/20'

    return (
        <button
            type={type}
            onClick={onClick}
            className={`${base}${styles} ${className}`}
            {...rest}
        >
            {children}
        </button>
    )
}