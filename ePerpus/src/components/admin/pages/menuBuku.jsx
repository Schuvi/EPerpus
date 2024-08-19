import React from "react";
import { useNavigate } from "react-router-dom";

export default function MenuBuku() {
    const navigate = useNavigate()
    
    return (
        <>
            <section className="h-[50vh]">
                <h1 className="text-center mt-5 text-2xl font-bold">Menu Buku</h1>
                
                <div className="h-full flex flex-row items-center justify-evenly">
                    <div className="container w-1/4 border h-[20vh] flex flex-col items-center justify-center rounded-lg bg-pallet1 hover:shadow-xl cursor-pointer" onClick={() => navigate("/admin/buku/manajemen")}>
                        <i className="fa-solid fa-book text-[2.5em] text-white"></i>
                        <h1 className="text-xl text-white">Manajemen Buku</h1>
                    </div>
                    <div className="container w-1/4 border h-[20vh] flex flex-col items-center justify-center rounded-lg bg-pallet1 hover:shadow-xl cursor-pointer" onClick={() => navigate("/admin/dashboard")}>
                        <i className="fa-solid fa-handshake text-[2.5em] text-white"></i>
                        <h1 className="text-xl text-white">Transaksi Buku (Pinjam / Kembalikan)</h1>
                    </div>
                </div>
            </section>
        </>
    )
}