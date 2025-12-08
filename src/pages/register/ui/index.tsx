import { RegisterForm } from "../../../features/auth"
import "./index.css"

export const RegisterPage = () => {
  return (
    <>
      <div className="min-h-screen bg-var(--background) flex items-center justify-center p-4">
        <RegisterForm />
    </div>
    </>
  )
}