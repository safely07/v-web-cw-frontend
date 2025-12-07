import { Header } from "../../../widgets/layout" 
import { PressButton } from "../../../shared/ui/press-button"
import "./index.css"

export const RegisterPage = () => {
  return (
    <>
      <Header />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1>Регистрация</h1>
        <PressButton moveTo={'/home'}>
        Зарегистрироваться
        </PressButton>
        Есть аккаунт?
        <PressButton moveTo={'/'}>
        Вход
        </PressButton>
      </div>
    </>
  )
}