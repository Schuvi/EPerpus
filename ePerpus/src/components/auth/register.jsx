import { useMutation } from "@tanstack/react-query";
import React, {useEffect, useState} from "react";
import axios from "axios";
import {useNavigate, Link} from "react-router-dom";

export default function Register() {
    const [data, setData] = useState({
        id_user: "",
        nama_lengkap: "",
        email: "",
        password: "",
        role: "",
        gambar_profil: null,
    });
    const [showPass, setShowPass] = useState(false)

    const navigate = useNavigate();

    const base_url = import.meta.env.VITE_API_ENDPOINT;

    const register = useMutation({
        mutationFn: async (formData) => {
            const response = await axios.post(base_url + "/register", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            return response.data;
        },
        onSuccess: (data) => {
            alert("Registrasi Berhasil");
        },
        onError: (error) => {
            console.error("Error registering user:", error);
        }
    });

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

    const validatePassword = (password) => {
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumber = /\d/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

        return hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

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
        formData.append("role", "user");
        formData.append("gambar_profil", data.gambar_profil);

        axios.get(base_url + "/get/user")
        .then((res) => {
            const find = res.data.data.find(user=> user.id_user === data.id_user)

            if (find) {
                alert("Id user sudah ada")
            } else {
                register.mutate(formData)
                setData({
                    id_user: "",
                    nama_lengkap: "",
                    email: "",
                    password: "",
                    role: "",
                    gambar_profil: null,
                })
                navigate("/login")
            }
        })

    };

    const isShowPass = () => {
        setShowPass(!showPass)
    }
    
    return (
        <>
            <section className="flex justify-center items-center mt-5 p-2">
                <div className="container bg-pallet1 shadow-xl h-full rounded-lg p-3">
                    <h1 className="text-center text-lg font-bold mb-3 text-white md:text-2xl">Register Akun Baru</h1>

                    <form onSubmit={handleSubmit} className="flex flex-col justify-evenly h-[57vh]">
                        <label htmlFor="id_user" className="after:content-['*'] after:ml-0.5 after:text-red-700 text-white md:text-lg">
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
                        <label htmlFor="nama_lengkap" className="after:content-['*'] after:ml-0.5 after:text-red-700 text-white md:text-lg">
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
                        <label htmlFor="email" className="after:content-['*'] after:ml-0.5 after:text-red-700 text-white md:text-lg">
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
                        <label htmlFor="password" className="after:content-['*'] after:ml-0.5 after:text-red-700 text-white md:text-lg" min="8">
                            Password
                        </label>
                        <input 
                            type={showPass ? "text" : "password"} 
                            name="password" 
                            id="password" 
                            className="rounded-xl" 
                            placeholder="Masukkan Password Anda" 
                            value={data.password}
                            onChange={handleChange}
                            minLength={8}
                            required
                        />
                        <div className="container">
                            <input type="checkbox" id="check-pass" className="mr-3" onClick={isShowPass}/>
                            <label htmlFor="check-pass" className="text-white md:text-lg">
                                Tampilkan Password
                            </label>
                        </div>
                        <label htmlFor="gambar_profil" className="text-white md:text-lg">
                            Gambar Profile (Anda Bisa Mengaturnya Nanti)
                        </label>
                        <input 
                            type="file" 
                            name="gambar_profil" 
                            className="bg-white rounded-xl" 
                            onChange={handleChange}
                        />
                        <input type="text" name="role" id="role" hidden value={data.role} onChange={handleChange}/>

                        <div className="container text-center mt-3">
                            <Link to="/login" className="text-white hover:text-pallet3 md:text-lg">Sudah Memiliki Akun? Login Disini</Link>
                        </div>

                        <div className="container text-center mt-3">
                            <button type="submit" className="border w-[25vw] rounded-lg bg-pallet1 text-white p-2 md:text-lg">
                                Submit
                            </button>
                        </div>
                    </form>
                </div>
            </section>
        </>
    )
}