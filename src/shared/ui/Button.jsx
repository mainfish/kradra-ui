import { Link } from 'react-router-dom'

export default function Button({
    variant = 'primary', // 'primary' | 'ghost'
    className = '',
    type = 'button',
    to,
    onClick,
    disabled = false,
    children,
    ...rest
}) {
    const base =
        'rounded-xl px-4 py-2 text-sm font-semibold transition focus:outline-none focus:ring-2 '

    const styles =
        variant === 'primary'
            ? 'bg-white text-black hover:bg-white/90 focus:ring-white/30'
            : 'border border-white/10 bg-white/5 text-white/90 backdrop-blur-md hover:bg-white/10 focus:ring-white/20'

    const disabledStyles = 'opacity-60 pointer-events-none'
    const cls = `${base}${styles} ${disabled ? disabledStyles : ''} ${className}`

    // If `to` is provided, render a React Router Link for SPA navigation.
    if (to) {
        return (
            <Link to={to} onClick={onClick} className={cls} {...rest}>
                {children}
            </Link>
        )
    }

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={cls}
            {...rest}
        >
            {children}
        </button>
    )
}