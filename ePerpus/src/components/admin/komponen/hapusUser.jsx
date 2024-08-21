import { useMutation } from "@tanstack/react-query";
import React from "react";
import axios from "axios";

export default function HapusUser() {
    const base_url = import.meta.env.VITE_API_ENDPOINT

    const [form, setForm] = React.useState("")

    const hapus = useMutation({
        mutationFn: async (id) => {
            const response = await axios.delete(base_url + "/delete/user", {
                params: {id_user: id}
            })

            return response.data
        },
        onSuccess: (data) => {
            alert("Berhasil Menghapus User")
            window.location.reload()
        },
        onError: (error) => {
            alert("Gagal Menghapus User")
        }
    })

    const handleChange = (e) => {
        setForm(e.target.value)
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        const id = form

        hapus.mutate(id)
    }

    return (
        <>
            <form onSubmit={handleSubmit}>
                <input type="text" className="rounded-lg mr-3" name="form" id="form" value={form} onChange={handleChange} required/>

                <button type="submit" className="border p-2 rounded-lg bg-red-700 text-white">
                    Hapus
                </button>
            </form>
        </>
    )
}