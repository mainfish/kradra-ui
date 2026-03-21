export default function Panel({ className = '', children }) {
    return (
        <div
            className={
                'rounded-2xl border border-white/10 bg-slate-950/56 shadow-2xl backdrop-blur-md ' +
                className
            }
        >
            {children}
        </div>
    )
}