export default function ProfilePage({ user }) {
    return (
        <div className="space-y-3">
            <h1 className="text-2xl font-semibold tracking-tight text-white">Profile</h1>
            <p className="text-white/60">Placeholder page.</p>
            <pre className="text-white/70 text-sm whitespace-pre-wrap">
                {JSON.stringify(user, null, 2)}
            </pre>
        </div>
    )
}