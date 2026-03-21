import { useNavigate } from 'react-router-dom'

import StarfieldBackground from '../../components/Background/StarfieldBackground'

export default function LandingPage() {
    const navigate = useNavigate()

    return (
        <div className="relative min-h-screen overflow-x-hidden overflow-y-auto bg-[#05070b]">
            <StarfieldBackground />

            <div className="fixed top-6 right-6 z-40 flex items-center gap-3">
                <button
                    type="button"
                    onClick={() => navigate('/login')}
                    className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white/90 backdrop-blur-md transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/20"
                >
                    Log in
                </button>

                <button
                    type="button"
                    onClick={() => navigate('/register')}
                    className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-black transition hover:bg-white/90 focus:outline-none focus:ring-2 focus:ring-white/30"
                >
                    Register
                </button>
            </div>

            <div className="relative z-10 mx-auto max-w-5xl px-6 pt-24 pb-10">
                <div className="rounded-2xl border border-white/10 bg-slate-950/56 p-10 shadow-2xl backdrop-blur-md">
                    <h1 className="text-3xl font-semibold tracking-tight text-white">Kradra Portal</h1>
                    <p className="mt-3 max-w-xl text-white/60">
                        Welcome. Please log in or create an account to continue.
                    </p>
                </div>
            </div>
        </div>
    )
}