import React from "react"
import logo from "../../assets/logo.png"

export default function Footer() {
    return (
        <>
            <section className="flex flex-col justify-center items-center p-3 mt-auto bg-pallet2 shadow-lg h-fit ">
                <div className="container flex justify-center items-center mb-5">
                    <img src={logo} alt="logo techlibrary" className="w-[20vw] md:w-[15vw] lg:w-[9vw] xl:w-[9vw]"/>
                    <h1 className="text-2xl md:text-[2rem] font-bold">TechLibrary</h1>
                </div>
                <div className="container text-center">
                    <h1 className="md:text-2xl xl:text-xl">Perpustakaan Online Terlengkap dan Terbaik Sepanjang Masa</h1>
                </div>
                <div className="container flex justify-center mt-2">
                    <a href="https://www.instagram.com/schuv_i/" target="_blank" className="mr-3 text-2xl md:text-3xl">
                        <i class="fa-brands fa-square-instagram"></i>
                    </a>
                    <a href="https://wa.me/+6281947168037" target="_blank" className="text-2xl md:text-3xl">
                        <i class="fa-brands fa-square-whatsapp"></i>
                    </a>
                </div>
                <div className="container text-center mt-2">
                    <h1 className="md:text-xl">&copy; TechLibrary</h1>
                </div>
            </section>
        </>
    )
}