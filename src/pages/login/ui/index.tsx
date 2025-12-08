import { Header } from "../../../widgets/layout" 
import { LoginForm } from "../../../features/auth"
import "./index.css"

export const LoginPage = () => {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-var(--background) flex items-center justify-center p-4">
        <LoginForm />
    </div>
    </>
  )
}