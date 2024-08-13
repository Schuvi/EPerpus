import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import React, {useState} from "react";
import { useLocation } from "react-router-dom";

export default function BorrowBooks() {
    const location = useLocation();
    const {buku} = location.state

    const [durasi, setDurasi] = useState("");
    const [tanggalPengembalian, setTanggalPengembalian] = useState("");

    const base_url = import.meta.env.VITE_API_ENDPOINT

    const user = window.localStorage.getItem("id_user")

    const date = new Date()
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Adding 1 because getMonth() is 0-indexed
    const day = String(date.getDate()).padStart(2, '0');

    const dateNow = year + "-" + month + "-" + day;

    const handleDurasiChange = (e) => {
        const durasiTerpilih = parseInt(e.target.value);
        setDurasi(durasiTerpilih);
        
        if (durasiTerpilih) {
            const tanggalPeminjaman = new Date(dateNow);
            tanggalPeminjaman.setDate(tanggalPeminjaman.getDate() + durasiTerpilih);
            setTanggalPengembalian(tanggalPeminjaman.toISOString().split('T')[0]);
        } else {
            setTanggalPengembalian("");
        }
    };

    const pinjam = useMutation({
        mutationFn: async (formData) => {
            const response = await axios.post(base_url +"/transaction", formData, {
                headers: {
                    "Content-Type": "application/json",
                }
            })

            return response.data
        },
        onSuccess: (data) => {
            if (data.message === "Berhasil Meminjam Buku") {
                alert("Berhasil Meminjam Buku")
            }
        },
        onError: (error) => {
            alert("Gagal Meminjam Buku")
        }
    })

    const handleSubmit = (e) => {
        e.preventDefault()

        const formData = new FormData()
        formData.append("id_user", user)
        formData.append("tanggal_peminjaman", dateNow)
        formData.append("tanggal_pengembalian", tanggalPengembalian)
        formData.append("buku_ids", [buku.id_buku])

        pinjam.mutate(formData)
    }

    return (
        <section className="h-fit p-3">
            <div className="container border rounded-lg p-2">
                <h1 className="text-xl text-center mb-3 font-bold">Formulir Pinjam Buku</h1>
                <h1>Buku yang akan dipinjam :</h1>

                <div className="container h-[20vh] flex mt-3">
                    <div className="container w-1/3 flex justify-center mr-3">
                        <img src={buku.gambar_buku} alt="sampul buku yang akan dipinjam" className="h-full rounded-lg"/>
                    </div>
                    <div className="container w-1/2">
                        <h1 className="font-bold">Judul Buku :</h1>
                        <p>{buku.judul_buku}</p>
                        <h1 className="font-bold">Tahun Buku:</h1>
                        <p>{buku.tahun_buku}</p>
                        <h1 className="font-bold">Penerbit Buku :</h1>
                        <p>{buku.penerbit_buku}</p>
                    </div>
                </div>

                <form className="mt-3 flex flex-col" onSubmit={handleSubmit}>
                    <input type="text" value={user} hidden/>
                    <label htmlFor="tanggal_peminjaman">Tanggal Peminjaman</label>
                    <input type="text" name="tanggal_peminjaman" id="tanggal_peminjaman" defaultValue={dateNow} className="bg-gray-400 rounded-lg" disabled/>
                    
                    <label htmlFor="durasi">Durasi Peminjaman</label>
                    <select name="durasi" id="durasi" value={durasi} onChange={handleDurasiChange}>
                        <option value="">Pilih Durasi Peminjaman</option>
                        <option value="7">1 Minggu</option>
                        <option value="14">2 Minggu</option>
                        <option value="21">3 Minggu</option>
                        <option value="30">1 Bulan</option>
                    </select>

                    <label htmlFor="tanggal_pengembalian">Tanggal Pengembalian</label>
                    <input type="text" id="tanggal_pengembalian" name="tanggal_pengembalian" value={tanggalPengembalian}/>
                    
                    <input type="text" value={buku.id_buku} hidden/>

                    <div className="container text-center mt-3">
                        <button type="submit" className="border p-2 w-[25vw] text-white bg-pallet1 rounded-lg">
                            Pinjam
                        </button>
                    </div>
                </form>

            </div>
        </section>
    )
}