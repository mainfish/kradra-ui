import AuthLayout from './components/Layout/AuthLayout'
import { LoginForm } from './features/auth'

export default function App() {
  return (
    <AuthLayout>
      <LoginForm />
    </AuthLayout>
  )
}
