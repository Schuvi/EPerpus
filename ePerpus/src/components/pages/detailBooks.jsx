import React, {useState} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useMutation, useQuery } from "@tanstack/react-query";

export default function DetailBooks() {
    const location = useLocation();
    const {detail} = location.state
    const navigate = useNavigate()

    const user = window.localStorage.getItem("id_user")

    const base_url = import.meta.env.VITE_API_ENDPOINT

    const fetch = async () => {
        const response = await axios.get(base_url + `/get/books/fav?id_user=${id_user}`);
        return response.data;
    };

    const { data } = useQuery({
        queryKey: ["favorite-books"],
        queryFn: fetch,
    });
    

    const favorite = useMutation({
        mutationFn: async (formData) => {
            const response = await axios.post(base_url+ "/favorite", formData, {
                headers: {
                    "Content-Type": "application/json"
                }
            })
            return response.data
        },
        onSuccess: (data) => {
            console.log(data)
            if (data.message == "Berhasil menambahkan buku ke favorit") {
                alert("Berhasil menambah buku ke Favorit")
            } else if (data.message == "Buku telah menjadi favorit") {
                alert("Buku Sudah Menjadi Favorit");
            }
        },
        onError: (error) => {
            if (error) {
                alert("Gagal menambah buku ke Favorit")
            }
        }
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData()
        formData.append("id_user", user)
        formData.append("id_buku", detail.id_buku)

        favorite.mutate(formData)
    };

    const pinjamBuku = (detail) => {
        navigate("/buku/pinjam", {state: {buku: detail}})
    }

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
                        <h1 className="text-sm text-gray-400 md:text-lg">{detail.pengarang_buku}</h1>
                        <h1 className="text-2xl text-pallet2 font-bold md:text-3xl">{detail.judul_buku}</h1>
                        <h1 className={`${detail.status == "Dipinjam" ? "text-blue-500" : detail.status == "Tersedia" ? "text-green-500" : detail.status == "Rusak" ? "text-red-500" : "text-red-300"} md:text-lg`}>{detail.status}</h1>
                    </div>
                    <form onSubmit={handleSubmit} className="container flex flex-col justify-end text-end p-2">
                        <button type="submit" className="text-end">
                            <i className={`fa-solid fa-bookmark text-[2em] mr-9 text-pallet2 md:text-[2.5em]`}></i>
                        </button>
                            <h1 className={`md:text-lg`}>{data.data.find(book => book.id_buku === detail.id_buku) ? "Buku Favorit" : "Jadikan Favorit"}</h1>
                    </form> 
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
                        <a href={detail.file_buku} target="_blank" className="text-blue-500">{detail.file_buku}</a>
                        <h3>Telah Dipinjam : {detail.banyak_pinjaman} kali</h3>
                    </div>
                </div>
                <div className="container mt-5 text-center">
                    <button className={`border w-[40vw] h-[5vh] rounded-lg ${detail.status == "Dipinjam" ? "bg-slate-500" : detail.status == "Rusak" ? "bg-slate-500" : detail.status == "Tersedia" ? "bg-pallet1" : "bg-slate-500"} text-white hover:bg-slate-500`} onClick={() => pinjamBuku(detail)} disabled={detail.status == "Dipinjam" ? true : detail.status == "Rusak" ? true : detail.status == "Tersedia" ? false : true}>{detail.status == "Tersedia" ? "Pinjam Buku" : detail.status == "Rusak" ? "Buku Rusak" : detail.status == "Dipinjam" ? "Buku Telah Dipinjam" : "Pinjam Buku"}</button>
                </div>
            </div>
        </>
    )
}