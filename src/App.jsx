import { useState } from 'react'
import { Route, Routes } from "react-router-dom";
import './App.css'
import Home from './pages/Home';
import Navbar from './components/Navbar';
import ProtectedRoutes from './pages/ProtectedRoutes';
import SellerDash from './pages/SellerDash';
import UpdatePost from './pages/UpdatePost';
import Explore from './pages/Explore';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <Navbar />
    <Routes>
      <Route path='/' element={<Home/>} />
      <Route path='/explore/:city' element={<Explore />} />
      <Route element={<ProtectedRoutes />}>
         <Route path='/dashboard' element={<SellerDash/>} />
         <Route path='/update-post' element={<UpdatePost />}/>
      </Route>
    </Routes>
    </>
  )
}

export default App
