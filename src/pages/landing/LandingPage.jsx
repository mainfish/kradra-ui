import { useNavigate } from 'react-router-dom'

import StarfieldBackground from '../../components/Background/StarfieldBackground'
import Button from '../../shared/ui/Button'
import Panel from '../../shared/ui/Panel'

export default function LandingPage() {
    const navigate = useNavigate()

    return (
        <div className="relative min-h-screen overflow-x-hidden overflow-y-auto bg-[#05070b]">
            <StarfieldBackground />

            <div className="fixed top-6 right-6 z-40 flex items-center gap-3">
                <Button variant="ghost" onClick={() => navigate('/login')}>
                    Log in
                </Button>

                <Button variant="primary" onClick={() => navigate('/register')}>
                    Register
                </Button>
            </div>

            <div className="relative z-10 mx-auto max-w-5xl px-6 pt-24 pb-10">
                <Panel className="p-10">
                    <h1 className="text-3xl font-semibold tracking-tight text-white">Kradra Portal</h1>
                    <p className="mt-3 max-w-xl text-white/60">
                        Welcome. Please log in or create an account to continue.
                    </p>
                </Panel>
            </div>
        </div>
    )
}