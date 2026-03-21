export default function HomePage({ user }) {
    return (
        <div className="space-y-3">
            <h1 className="text-2xl font-semibold tracking-tight text-white">
                Welcome, {user?.username || 'user'}
            </h1>
            <p className="text-white/60">
                This is a placeholder page. Next we’ll add real sections here.
            </p>
        </div>
    )
}