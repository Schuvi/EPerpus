import React, { useState } from "react";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { useLocation, useNavigate } from "react-router-dom";

export default function EditProfile() {
    const location = useLocation()
    const {edit} = location.state
    const navigate = useNavigate()

    const [data, setData] = useState({
        nama_lengkap: `${edit.nama_lengkap}`,
        email: `${edit.email}`,
        gambar_profil: null,
        role: "user"
    })

    const base_url = import.meta.env.VITE_API_ENDPOINT

    const editProfile = useMutation({
        mutationFn: async (formData) => {
            const response = await axios.put(base_url + `/edit/user?id_user=${edit.id_user}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            console.log(response.data)
            return response.data
        },
        onSuccess: (data) => {
            if (data.message === "Berhasil Mengedit User") {
                alert(data.message)
            } else {
                alert("Gagal Mengedit User")
            }

            window.localStorage.removeItem("username")
            window.localStorage.setItem("username", data.data.nama_lengkap)

            navigate("/profile")
        },
        onError: (error) => {
            console.log(error)
        }
    })

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        
        if (type === "file") {
            setData((prevData) => ({
                ...prevData,
                [name]: files[0]
            }));
        } else {
            if (name === "nama_lengkap") {
                const oneSpaceOnly = value.replace(/\s+/g, ' ');
                setData((prevData) => ({
                    ...prevData,
                    [name]: oneSpaceOnly
                }));
            } else {
                setData((prevData) => ({
                    ...prevData,
                    [name]: value
                }));
            }
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData()
        formData.append("nama_lengkap", data.nama_lengkap)
        formData.append("email", data.email)
        formData.append("gambar_profil", data.gambar_profil)
        formData.append("role", data.role)

        editProfile.mutate(formData)
    }
    
    return(
        <>
            <section className="h-[60vh]">
                <h1 className="text-center font-bold text-xl mb-2 mt-5">Edit Profile</h1>

                <form className="flex flex-col p-2" onSubmit={handleSubmit}>
                    <label htmlFor="nama_lengkap" className="after:content-['*'] after:ml-1 after:text-red-700">Nama Lengkap</label>
                    <input type="text" className="rounded-lg" name="nama_lengkap" id="nama_lengkap" value={data.nama_lengkap} placeholder="Masukkan Nama Lengkap" onChange={handleChange} required/>

                    <label htmlFor="email" className="after:content-['*'] after:ml-1 after:text-red-700">Email</label>
                    <input type="email" name="email" className="rounded-lg" value={data.email} placeholder="Masukkan Email" onChange={handleChange} required/>

                    <label htmlFor="gambar_profil">Gambar Profile</label>
                    <input type="file" className="rounded-lg" onChange={handleChange}/>
                    <p className="text-sm text-red-500">Biarkan Kosong Jika Tidak Ingin Mengganti Foto Profile</p>

                    <input type="text" name="role" id="role" defaultValue={data.role} hidden/>
                    
                    <div className="container text-center mt-4">
                        <button type="submit" className="rounded-lg border p-2 bg-pallet1 text-white">
                            Ganti Profile
                        </button>
                    </div>

                </form>

                <div className="container">
                    <h1 className="text-center mt-2 font-bold">Jika Ingin Mengganti Password Silahkan Hubungi Admin</h1>
                </div>
            </section>
        </>
    )
}