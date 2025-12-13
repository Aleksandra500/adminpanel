import { Outlet } from "react-router-dom"
import ProductsPage from "./pages/ProductsPage"

function App() {


  return (
    <>
   <ProductsPage/>
     <Outlet/>
    </>
  )
}

export default App
