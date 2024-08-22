import { useMutation } from "@tanstack/react-query";
import React, { useState } from "react";
import axios from "axios";

export default function EditStatus() {
    const base_url = import.meta.env.VITE_API_ENDPOINT

    const [form, setForm] = useState({
        id_user: "",
        status: 0
    })

    const update = useMutation({
        mutationFn: async (formData) => {
            const response = await axios.put(base_url + "/edit/user/stat", formData, {
                headers: {
                    "Content-Type": "application/json",
                }
            })

            return response.data
        },
        onSuccess: (data) => {
            if (data.state === "error") {
                alert("Gagal Mengganti Status User")
            } else {
                alert("Berhasil Mengganti Status User")
            }
        },
        onError: (error) => {
            alert("Gagal Mengganti Status User")
        }
    })

    const handleChange = (e) => {
        const {name, value} = e.target

        setForm((prevData) => ({
            ...prevData,
            [name]: value
        }))

        console.log(form)
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        const formData = new FormData()
        formData.append("id_user", form.id_user)
        formData.append("status", form.status)

        setForm({
            id_user: "",
            status: 0
        })

        update.mutate(formData)
    }
    
    return(
        <>
            <form onSubmit={handleSubmit} className="flex flex-col w-[70vw]">
                <label htmlFor="id_user" className="after:content-['*'] after:ml-0.5 after:text-red-700 md:text-lg">ID User</label>
                <input className="rounded-lg" type="text" value={form.id_user} onChange={handleChange} name="id_user" id="id_user"/>

                <label htmlFor="status" className="after:content-['*'] after:ml-0.5 after:text-red-700 md:text-lg">Status User</label>
                <select className="rounded-lg" name="status" id="status" value={form.status} onChange={handleChange}>
                    <option value="">Pilih Status User</option>
                    <option value={2}>Aktif</option>
                    <option value={4}>Blokir</option>
                </select>

                <div className="container text-center">
                    <button type="submit" className="border p-2 rounded-lg bg-pallet1 text-white mt-3">Ubah</button>
                </div>
            </form>
        </>
    )
}