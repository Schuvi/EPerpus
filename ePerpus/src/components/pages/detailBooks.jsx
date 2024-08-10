import React, {useState} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios"

export default function DetailBooks() {
    const location = useLocation();
    const {detail} = location.state
    const navigate = useNavigate()

    const base_url = import.meta.env.VITE_API_ENDPOINT

    return (
        <>
            <div className="container p-2">
                <div className="container flex justify-center">
                    <img src={detail.gambar_buku} alt={`Sampul Buku ${detail.judul_buku}`} className="rounded-lg w-[40vw]"/>
                </div>
            </div>
            <div className="container mt-5 p-2">
                <div className="container flex justify-between">
                    <div className="container">
                        <h1 className="text-sm text-gray-400">{detail.pengarang_buku}</h1>
                        <h1 className="text-2xl text-pallet2 font-bold">{detail.judul_buku}</h1>
                        <h1 className={`${detail.status == "Dipinjam" ? "text-blue-500" : detail.status == "Tersedia" ? "text-green-500" : detail.status == "Rusak" ? "text-red-500" : "text-red-300"}`}>{detail.status}</h1>
                    </div>
                    <div className="container flex flex-col justify-end text-end p-2">
                        <i className={`fa-solid fa-bookmark text-[2em] mr-9 text-pallet2`}></i>
                        <h1>Jadikan Favorit</h1>
                    </div> 
                </div>
                <div className="container flex flex-col justify-between mt-5">
                    <div className="container mb-3">
                        <h1 className="text-lg mb-3 font-bold">Deskripsi Buku</h1>
                        <p>
                            {detail.deskripsi_buku}
                        </p>
                    </div>
                    <div className="container">
                        <h1 className="text-lg mb-3 font-bold">Detail Buku</h1>
                        <h3>Penerbit Buku : {detail.penerbit_buku}</h3>
                        <h3>Tahun Terbit : {detail.tahun_buku}</h3>
                        <h3>Baca Online :</h3>
                        <a href={detail.file_buku} target="_blank">{detail.file_buku}</a>
                        <h3>Telah Dipinjam : {detail.banyak_pinjaman} kali</h3>
                    </div>
                </div>
                <div className="container mt-5 text-center">
                    <button className={`border w-[40vw] h-[5vh] rounded-lg ${detail.status == "Dipinjam" ? "bg-slate-500" : detail.status == "Rusak" ? "bg-slate-500" : detail.status == "Tersedia" ? "bg-pallet1" : "bg-slate-500"} text-white hover:bg-slate-500`} onClick={() => navigate("/")} disabled={detail.status == "Dipinjam" ? true : detail.status == "Rusak" ? true : detail.status == "Tersedia" ? false : true}>{detail.status == "Tersedia" ? "Pinjam Buku" : detail.status == "Rusak" ? "Buku Rusak" : detail.status == "Dipinjam" ? "Buku Telah Dipinjam" : "Pinjam Buku"}</button>
                </div>
            </div>
        </>
    )
}