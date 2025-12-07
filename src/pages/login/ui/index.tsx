import { Header } from "../../../widgets/layout" 
import { PressButton } from "../../../shared/ui/press-button"
import "./index.css"

export const LoginPage = () => {
  return (
    <>
      <Header />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1>Вход</h1>
        <PressButton moveTo={'/home'}>
        Войти
        </PressButton>
        Нет аккаунта?
        <PressButton moveTo={'/register'}>
        Зарегистрироваться
        </PressButton>
      </div>
    </>
  )
}