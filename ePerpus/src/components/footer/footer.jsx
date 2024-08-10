import React from "react"
import logo from "../../assets/logo.png"

export default function Footer() {
    return (
        <>
            <section className="flex flex-col justify-center items-center p-3 mt-5 bg-pallet1 shadow-lg h-[29vh]">
                <div className="container flex justify-center items-center mb-5">
                    <img src={logo} alt="logo techlibrary" className="w-[20vw]"/>
                    <h1 className="text-2xl font-bold">TechLibrary</h1>
                </div>
                <div className="container text-center">
                    <h1>Perpustakaan Online Terlengkap dan Terbaik Sepanjang Masa</h1>
                </div>
                <div className="container flex justify-center mt-2">
                    <a href="https://www.instagram.com/schuv_i/" target="_blank" className="mr-3 text-2xl">
                        <i class="fa-brands fa-square-instagram"></i>
                    </a>
                    <a href="https://wa.me/+6281947168037" target="_blank" className="text-2xl">
                        <i class="fa-brands fa-square-whatsapp"></i>
                    </a>
                </div>
                <div className="container text-center mt-2">
                    <h1>&copy; TechLibrary</h1>
                </div>
            </section>
        </>
    )
}