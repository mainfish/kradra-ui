import { Link } from 'react-router-dom'

export default function LinkButton({ to, className = '', children, ...rest }) {
    return (
        <Link
            to={to}
            className={
                'inline-block underline underline-offset-4 text-white hover:text-white/90 ' + className
            }
            {...rest}
        >
            {children}
        </Link>
    )
}