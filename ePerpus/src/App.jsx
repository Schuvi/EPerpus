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
import FavoriteBooks from "./components/pages/favoriteBooks";
import BorrowBooks from "./components/pages/pinjamBuku";
import Invoice from "./components/pages/invoice";
import Employee from "./components/pages/pustakawan";
import Profile from "./components/pages/profile";
import EditProfile from "./components/pages/editProfile";
import Dashboard from "./components/admin/pages/dashboard";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import RedirectLoggedIn from "./components/auth/redirectLogged";
import { Route, Routes, Navigate } from "react-router-dom";

export default function App() {
  const isLoggedIn = window.localStorage.getItem("isLoggedIn")
  const role = window.localStorage.getItem("role")

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
                  
                  {isLoggedIn && role == "user" ? (
                    <>
                      <Route path="/search" element={<Search />}/>
                      <Route path="/detail/id/:id_buku" element={<DetailBooks />}/>
                      <Route path="/buku" element={<BookAll />}/>
                      <Route path="/buku/populer" element={<BookPopular />}/>
                      <Route path="/buku/favorit" element={<FavoriteBooks />}/>
                      <Route path="/buku/pinjam" element={<BorrowBooks />}/>
                      <Route path="/buku/pinjam/invoice" element={<Invoice />}/>
                      <Route path="/profile" element={<Profile />}/>
                      <Route path="/profile/edit" element={<EditProfile />}/>
                      <Route path="/admin/dashboard" element={<Navigate to="/" />}/>
                    </>
                  ) : (
                    <>
                      <Route path="/admin/dashboard" element={<Dashboard />}/>
                    </>
                  )}

                </Route>

                <Route element={<RedirectLoggedIn/>}>
                  <Route path="/login" element={<Login />}/>
                  <Route path="/register" element={<Register />}/>
                </Route>

                <Route path="*" element={<div>Halaman Tidak ada</div>}/>
                <Route path="/" element={<Home />}/>
                <Route path="/pustakawan" element={<Employee />}/>

              </Routes>
            </div>
            <Footer/> 
          </>
        ) 
    }
    </div>
  )
}