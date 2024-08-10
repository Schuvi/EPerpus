import React, { useEffect, useState } from "react";
import Navbar from "./components/navbar/navbar";
import Home from "./components/pages/home";
import Splash from "./components/pages/splash_screen";
import Footer from "./components/footer/footer";
import Search from "./components/pages/search";
import BookAll from "./components/pages/book_all";
import BookPopular from "./components/pages/book_popular";
import { Route, Routes } from "react-router-dom";
import DetailBooks from "./components/pages/detailBooks";

export default function App() {
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
            <Navbar/>
            <div className="wrapper-content font-firaSans">
              <Routes>
                <Route path="/" element={<Home />}/>
                <Route path="/search" element={<Search />}/>
                <Route path="/detail/id/:id_buku" element={<DetailBooks />}/>
                <Route path="/buku" element={<BookAll />}/>
                <Route path="/buku/populer" element={<BookPopular />}/>
              </Routes>
            </div>
            <Footer/> 
          </>
        ) 
    }
    </div>
  )
}