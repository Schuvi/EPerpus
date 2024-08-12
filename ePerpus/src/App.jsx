import React, { useEffect, useState } from "react";
import Navbar from "./components/navbar/navbar";
import Home from "./components/pages/home";
import Splash from "./components/pages/splash_screen";
import Footer from "./components/footer/footer";
import Search from "./components/pages/search";
import BookAll from "./components/pages/book_all";
import BookPopular from "./components/pages/book_popular";
import Register from "./components/auth/register";
import Login from "./components/auth/login";
import DetailBooks from "./components/pages/detailBooks";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { Route, Routes, Navigate } from "react-router-dom";

export default function App() {
  const isLoggedIn = window.localStorage.getItem("isLoggedIn")
  console.log(isLoggedIn)

  const [showSplash, setShowSplash] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false)
    }, 1500);
    return () => clearTimeout(timer);
  }, [])
  
  return (
    <div className="wrapper-all font-firaSans">
      {showSplash ? 
        (<Splash/>) : (
          <>
            <Navbar />
            <div className="wrapper-content font-firaSans">
              <Routes>
                <Route element={<ProtectedRoute />}>

                {isLoggedIn ? (
                  <>
                    <Route path="/search" element={<Search />}/>
                    <Route path="/detail/id/:id_buku" element={<DetailBooks />}/>
                    <Route path="/buku" element={<BookAll />}/>
                    <Route path="/buku/populer" element={<BookPopular />}/>
                  </>
                ) : (
                  <>
                    <Route path="/search" element={<Navigate to="/login" />}/>
                    <Route path="/detail/id/:id_buku" element={<Navigate to="/login" />}/>
                    <Route path="/buku" element={<Navigate to="/login" />}/>
                    <Route path="/buku/populer" element={<Navigate to="/login" />}/>
                  </>
                )}

                </Route>

                <Route path="*" element={<div>Halaman Tidak ada</div>}/>
                <Route path="/login" element={<Login />}/>
                <Route path="/register" element={<Register />}/>
                <Route path="/" element={<Home />}/>
              </Routes>
            </div>
            <Footer/> 
          </>
        ) 
    }
    </div>
  )
}