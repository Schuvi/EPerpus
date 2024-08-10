import React, { useState } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

export default function Search() {
    const [hasil, setHasil] = useState({})
    const [cari, setCari] = useState("")
    const [style, setStyle] = useState("hidden")
    const [style1, setStyle1] = useState("hidden")
    
    const base_url = import.meta.env.VITE_API_ENDPOINT

    const handleSubmit = (e) => {
        e.preventDefault()

        axios.get(base_url + `/search/books?cari=${cari}`)
        .then((res) => {
            if (res.data.data) {
                setHasil(res.data.data[0])
                setStyle("block")
                setStyle1("hidden")
            } else if (res.data.message) {
                setHasil(res.data.message)
                setStyle("hidden")
                setStyle1("block")
            }
        })
    }
    

    return (
     <>
        <section className="h-[51.1vh]">
            <form onSubmit={handleSubmit} className="p-2 w-full">
                <input type="search" placeholder="Cari Buku" value={cari} onChange={(e) => setCari(e.target.value)} className="w-[80vw] rounded-xl"/> 
                <button type="submit" className="ml-2 border rounded-xl bg-pallet1 text-white h-[5.5vh] w-[13vw]">
                    Cari
                </button>
            </form>
            <section className={`p-2 ${style1} text-center`}>
                <h1>Buku Tidak Ditemukan</h1>
            </section>
            <section className={`p-2 ${style}`}>
                <div className="container flex flex-row p-1 border items-center rounded-lg">
                    <div className="container w-[40vw]">
                        <img src={hasil.gambar_buku} alt="sampul buku" />
                    </div>
                    <div className="container ml-2">
                        <h1 className="font-bold text-xl">{hasil.judul_buku}</h1>
                        <h1>{hasil.pengarang_buku}</h1>
                        <h1 className={`${hasil.status == "Dipinjam" ? "text-pallet1" : hasil.status == "Tersedia" ? "text-green-500" : hasil.status == "Rusak" ? "text-red-500" : "text-pallet1"}`}>{hasil.status}</h1>
                        <div className="container mt-2">
                            <button className="rounded-lg border p-1 bg-pallet1 text-white w-[40vw]">
                                Selengkapnya
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </section>
     </>   
    )
}