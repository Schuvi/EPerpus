import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import React, {useState} from "react";

export default function CreateAdmin() {
    const [data, setData] = useState({
        id_user: "",
        nama_lengkap: "",
        email: "",
        password: "",
        gambar_profil: null
    })

    const base_url = import.meta.env.VITE_API_ENDPOINT

    const tambah = useMutation({
        mutationFn: async (formData) => {
            const response = await axios.post(base_url + "/register", formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            })

            return response.data
        },
        onSuccess: (data) => {
            alert("Berhasil Menambah User")
        },
        onError: (error) => {
            alert("Gagal Menambah User")
        }
    })

    const handleChange = (e) => {
        const {name, value, type, files} = e.target

        if (type === "file") {
            if (files && files.length > 0) {
                setData((prevData) => {
                    const newData = { ...prevData, [name]: files[0] };
                    return newData;
                });
            } else {
                console.warn('No file selected');
            }
        } else {
            setData((prevData) => ({
                ...prevData,
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

        if (!validatePassword(data.password)) {
            alert("Password Harus Mengandung SETIDAKNYA Huruf Besar, Huruf Kecil, Angka, dan Simbol.");
            return;
        } else if (data.password.length < 8 ) {
            alert("Password Harus Minimal 8 Karakter")
            return;
        } else if (!data.id_user.trim() || !data.nama_lengkap.trim() || !data.email.trim() || !data.password.trim()) {
            alert("Input tidak boleh kosong atau hanya berisi spasi.");
            return;
        }

        const formData = new FormData();
        formData.append("id_user", data.id_user);
        formData.append("nama_lengkap", data.nama_lengkap);
        formData.append("email", data.email);
        formData.append("password", data.password);
        formData.append("role", "admin");
        formData.append("gambar_profil", data.gambar_profil);

        axios.get(base_url + "/get/user")
        .then((res) => {
            const find = res.data.data.find(user=> user.id_user === data.id_user)

            if (find) {
                alert("Id User Sudah Digunakan")
            } else {
                tambah.mutate(formData)
                setData({
                    id_user: "",
                    nama_lengkap: "",
                    email: "",
                    password: "",
                    role: "",
                    gambar_profil: null,
                })
            }
        })
    }
    
    return(
        <>
            <form onSubmit={handleSubmit} className="flex flex-col w-[70vw]">
                <label htmlFor="id_user" className="after:content-['*'] after:ml-0.5 after:text-red-700 md:text-lg">
                    ID Pengguna
                </label>
                <input 
                    type="text" 
                    name="id_user" 
                    id="id_user" 
                    className="rounded-xl" 
                    placeholder="Masukkan Id Penggunna" 
                    value={data.id_pengguna}
                    onChange={handleChange}
                    required
                />
                <label htmlFor="nama_lengkap" className="after:content-['*'] after:ml-0.5 after:text-red-700 md:text-lg">
                    Nama Lengkap
                </label>
                <input 
                type="text" 
                    name="nama_lengkap" 
                    id="nama_lengkap" 
                    className="rounded-xl" 
                    placeholder="Masukkan Nama Lengkap Anda" 
                    value={data.nama_lengkap}
                    onChange={handleChange}
                    required
                />
                <label htmlFor="email" className="after:content-['*'] after:ml-0.5 after:text-red-700 md:text-lg">
                    Email
                </label>
                <input 
                    type="email" 
                    name="email" 
                    id="email" 
                    className="rounded-xl" 
                    placeholder="Masukkan Email Anda" 
                    value={data.email}
                    onChange={handleChange}
                    required
                />
                <label htmlFor="password" className="after:content-['*'] after:ml-0.5 after:text-red-700 md:text-lg" min="8">
                    Password
                </label>
                <input 
                    type="text"
                    name="password" 
                    id="password" 
                    className="rounded-xl" 
                    placeholder="Masukkan Password Anda" 
                    value={data.password}
                    onChange={handleChange}
                    minLength={8}
                    required
                />
                <input type="text" name="role" id="role" hidden value={data.role} onChange={handleChange}/> 

                <label htmlFor="gambar_profil">Gambar Profile</label>
                <input type="file" name="gambar_profil" id="gambar_profil" onChange={handleChange} required/>

                <div className="container text-center mt-3">
                    <button type="submit" className="border w-[25vw] rounded-lg bg-pallet1 text-white p-2 md:text-lg">
                        Submit
                    </button>
                </div>
            </form>
        </>
    )
}