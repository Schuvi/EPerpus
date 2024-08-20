import React from "react";
import { useNavigate } from "react-router-dom";

export default function TransactionPage() {
    const navigate = useNavigate()
    
    return(
        <>
            <section className="h-[50vh]">
                <h1 className="text-center font-bold text-2xl mt-5 mb-3">Halaman Transaksi</h1>

                <div className="flex flex-row justify-evenly items-center p-3 h-full">
                    <div className="container w-1/4 flex flex-col justify-center items-center border rounded-lg bg-pallet1 text-white h-[20vh] hover:shadow-lg hover:cursor-pointer hover:-translate-y-2 hover:transition-all" onClick={() => navigate("/admin/buku/dipinjam")}>
                        <i className="fa-solid fa-list text-[2.5em]"></i>
                        <h1 className="text-xl mt-2">Daftar Buku Dipinjam</h1>
                    </div>
                    <div className="container w-1/4 flex flex-col justify-center items-center border rounded-lg bg-pallet1 text-white h-[20vh] hover:shadow-lg hover:cursor-pointer hover:-translate-y-2 hover:transition-all" onClick={() => navigate("/admin/buku/pinjam")}>
                        <i className="fa-solid fa-bookmark text-[2.5em]"></i>
                        <h1 className="text-xl mt-2">Pinjam Buku</h1>
                    </div>
                    <div className="container w-1/4 flex flex-col justify-center items-center border rounded-lg bg-pallet1 text-white h-[20vh] hover:shadow-lg hover:cursor-pointer hover:-translate-y-2 hover:transition-all">
                        <i className="fa-solid fa-hand-holding-hand text-[2.5em]"></i>
                        <h1 className="text-xl mt-2">Kembalikan Buku</h1>
                    </div>
                </div>

            </section>
        </>
    )
}