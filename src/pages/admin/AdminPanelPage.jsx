export default function AdminPanelPage({ user }) {
    return (
        <div className="space-y-3">
            <h1 className="text-2xl font-semibold tracking-tight text-white">Admin panel</h1>
            <p className="text-white/60">Placeholder page.</p>
            <div className="text-white/70 text-sm">Role: {user?.role}</div>
        </div>
    )
}