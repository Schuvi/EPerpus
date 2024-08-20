import React, { useState } from "react";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";

export default function HapusBuku() {
    const base_url = import.meta.env.VITE_API_ENDPOINT

    const [id, setId] = useState("")

    const hapus = useMutation({
        mutationKey: ["hapusBuku"],
        mutationFn: async (id_buku) => {
            const response = await axios.delete(base_url + `/delete/books?id_buku=${id_buku}`)

            return response.data
        },
        onSuccess: (data) => {
            alert("Berhasil Menghapus Buku, refresh untuk melihat hasilnya")
        },
        onError: (error) => {
            alert("Gagal Menghapus Buku")
        }
    })

    const handleSubmit = (e) => {
        e.preventDefault()

        hapus.mutate(id)
    }

    return (
        <>
            <form onSubmit={handleSubmit}>
                <input type="text" value={id} onChange={(e) => setId(e.target.value)} placeholder="Masukkan Id Buku" className="rounded-lg"/>
                <button type="submit" className="border p-2 rounded-lg bg-red-700 text-white ml-2">Hapus</button>
            </form>
        </>
    )
}