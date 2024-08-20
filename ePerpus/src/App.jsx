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
import MenuBuku from "./components/admin/pages/menuBuku";
import ManajemenBuku from "./components/admin/pages/manajemenBuku";
import TransactionPage from "./components/admin/pages/transactionPage";
import DaftarBukuDipinjam from "./components/admin/pages/daftarBukuDipinjam";
import PinjamBukuAdmin from "./components/admin/pages/adminPinjamBuku";
import KembalikanBukuAdmin from "./components/admin/pages/adminKembaliBuku";
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
                  {isLoggedIn && role === "user" && (
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
                  )}
                  {isLoggedIn && role === "admin" && (
                    <>
                      <Route path="/admin/dashboard" element={<Dashboard />}/>
                      <Route path="/admin/buku" element={<MenuBuku />}/>
                      <Route path="/admin/buku/manajemen" element={<ManajemenBuku />}/>
                      <Route path="/admin/buku/transaksi" element={<TransactionPage/>}/>
                      <Route path="/admin/buku/dipinjam" element={<DaftarBukuDipinjam/>}/>
                      <Route path="/admin/buku/pinjam" element={<PinjamBukuAdmin/>}/>
                      <Route path="/admin/buku/kembali" element={<KembalikanBukuAdmin/>}/>
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