import './homeStyle.css'
import { Header } from '../../../widgets/layout/header'

export const Home = () => {
  return (
    <>
      <Header />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1>Главная</h1>
      </div>
    </>
  )
}
