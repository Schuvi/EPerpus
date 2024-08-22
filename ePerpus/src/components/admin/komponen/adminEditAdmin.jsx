import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import React from "react";

export default function EditAdmin() {
    const base_url = import.meta.env.VITE_API_ENDPOINT

    const [form, setForm] = React.useState({
        id_user: "",
        nama_lengkap: "",
        email: "",
        password: "",
        gambar_profil: null,
        role: "admin"
    })

    const editUser = useMutation({
        mutationFn: async (formData) => {
            const id_user = formData.get("id_user");
            const response = await axios.put(base_url + `/edit/user?id_user=${id_user}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            })
            console.log(response.data)
            return response.data
        },
        onSuccess: (data) => {
            alert("Berhasil Mengubah Akun Admin")
        },
        onError: (error) => {
            alert("Gagal Mengubah Akun Admin")
        }
    })

    const handleChange = (e) => {
        const {name, value, type, files} = e.target

        if (type === "file") {

            if (files && files.length > 0) {
                setForm((prevData) => {
                    const newData = { ...prevData, [name]: files[0] };
                    return newData;
                });
            } else {
                return "Belum Ada Gambar"
            }
            
        } else {
            setForm((prevForm) => ({
                ...prevForm,
                [name]: value
            }))
        }
    }

    const validatePassword = (password) => {
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumber = /\d/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

        return hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar;
    };

    const handleSubmit = (e) => {
        e.preventDefault()

        if (form.password !== "") {
            if (!validatePassword(form.password)) {
                alert("Password Harus Mengandung SETIDAKNYA Huruf Besar, Huruf Kecil, Angka, dan Simbol.");
                return;
            } else if (form.password.length < 8 ) {
                alert("Password Harus Minimal 8 Karakter")
                return;
            } else if (!form.id_user.trim() || !form.nama_lengkap.trim() || !form.email.trim() || !form.password.trim()) {
                alert("Input tidak boleh kosong atau hanya berisi spasi.");
                return;
            }
        }


        const formData = new FormData()
        formData.append("id_user", form.id_user)
        formData.append("nama_lengkap", form.nama_lengkap)
        formData.append("email", form.email)
        formData.append("password", form.password)
        formData.append("gambar_profil", form.gambar_profil)
        formData.append("role", form.role)

        formData.forEach((value, key) => {
            console.log(key, value);
        });

        editUser.mutate(formData)
    }
    
    return (
        <>
            <form className="flex flex-col w-[70vw]" onSubmit={handleSubmit}>
                <label htmlFor="id_user" className="after:content-['*'] after:ml-0.5 after:text-red-700 md:text-lg">ID User</label>
                <input type="text" className="rounded-lg " name="id_user" id="id_user" value={form.id_user} onChange={handleChange} required/>

                <label htmlFor="nama_lengkap" className="after:content-['*'] after:ml-0.5 after:text-red-700 md:text-lg">Nama Lengkap</label>
                <input type="text" className="rounded-lg " name="nama_lengkap" id="nama_lengkap" value={form.nama_lengkap} onChange={handleChange} required/>

                <label htmlFor="email" className="after:content-['*'] after:ml-0.5 after:text-red-700 md:text-lg">Email</label>
                <input type="email" className="rounded-lg " name="email" id="email" value={form.email} onChange={handleChange} required/>

                <label htmlFor="password" className="md:text-lg">Password</label>
                <input type="text" className="rounded-lg " name="password" id="password" value={form.password} onChange={handleChange}/>

                <label htmlFor="gambar_profil">Gambar Profile</label>
                <input type="file" name="gambar_profil" id="gambar_profil" onChange={handleChange}/>

                <div className="text-center mt-3">
                    <button type="submit" className="border p-2 text-white bg-pallet1 rounded-lg w-1/3 text-xl">
                        Edit
                    </button>
                </div>
            </form>
        </>
    )
}