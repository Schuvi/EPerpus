import React, {useState} from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";

export default function Login() {
    const navigate = useNavigate();
    const [data, setData] = useState({
        username: "",
        password: ""
    })

    const [showPass, setShowPass] = useState(false)

    const base_url = import.meta.env.VITE_API_ENDPOINT

    const login = useMutation({
        mutationFn: async (formData) => {
            const response = await axios.post(base_url + "/login", formData, {
                headers: {
                    "Content-Type": "application/json"
                }
            })

            return response.data
        },
        onSuccess: (data) => {
            if (data.message === "Berhasil Login sebagai User") {
                window.localStorage.setItem("username", data.data.nama_lengkap)
                window.localStorage.setItem("token", data.data)
                window.localStorage.setItem("id_user", data.data.id_user)
                window.localStorage.setItem("profile", data.data.gambar_profil)
                window.localStorage.setItem("isLoggedIn", true)
                
                axios.put(base_url + `/stat/login?id_user=${data.data.id_user}`)
                .then((res) => {
                    if (res.data.message === "Berhasil Login") {
                        alert(`Selamat Datang ${data.data.nama_lengkap}`)
                        navigate("/")
                    } else {
                        alert("Gagal Login")
                    }
                })

            } else if (data.message === "Berhasil Login sebagai Admin") {
                alert(`Selamat Datang Admin ${data.data.nama_lengkap}`)
            } else if (data.message === "Password salah") {
                alert("Password salah, silahkan hubungi admin jika anda lupa akan password anda")
            } else if (data.message === "User tidak ditemukan") {
                alert("User tidak ditemukan, silahkan registrasi terlebih dahulu")
            } else if (data.message === "Akun Anda Telah Login di Perangkat Lain") {
                alert("Akun Anda Telah Login di Perangkat Lain")
            } else if (data.message === "Akun Anda Telah Diblokir") {
                alert("Akun Anda Telah Diblokir")
            }
        },
        onError: (error) => {
            alert("Gagal Login")
        }
    })

    const handleSubmit = (e) => {
        e.preventDefault()

        const formData = new FormData()
        formData.append("username", data.username)
        formData.append("password", data.password)

        login.mutate(formData)
    }

    const handleChange = (e) => {
        setData({
            ...data,
            [e.target.name]: e.target.value
        });
    };

    return (
        <>
            <section className="p-2 h-[51.1vh] flex items-center">
                <div className="container bg-pallet1 rounded-lg p-2 h-[38vh] flex flex-col items-center">
                    <h1 className="text-white text-center text-lg font-bold">Login Akun</h1>
                
                    <form className="container flex flex-col justify-evenly" onSubmit={handleSubmit}>
                        <label htmlFor="nama_lengkap" className="after:content-['*'] after:ml-1 after:text-red-700 text-white">
                            Nama Lengkap
                        </label>
                        <input type="text" name="username" id="nama_lengkap" placeholder="Masukkan Nama Lengkap Anda" value={data.username} onChange={handleChange} required className="rounded-xl"/>

                        <label htmlFor="password" className="text-white after:content-['*'] after:text-red-700 after:ml-1">
                            Password
                        </label>
                        <input type={showPass ? "text" : "password"} name="password" id="password" placeholder="Masukkan Password Anda" value={data.password} className="rounded-xl" onChange={handleChange} autoComplete="off" required minLength={8}/>
                        <div className="container flex items-center mt-2">
                            <input type="checkbox" id="tampil" onClick={() => setShowPass(!showPass)}/>
                            <label htmlFor="tampil" className="text-white ml-1">Tampilkan Password</label>
                        </div>

                        <div className="container text-center mt-2">
                            <Link to="/register" className="text-white hover:text-pallet3">Belum Punya Akun? Register Disini</Link>
                        </div>

                        <div className="container text-center mt-2">
                           <button type="submit" className="border rounded-xl w-[35vw] h-[5vh] text-white">
                                Login
                            </button>
                        </div>
                    </form>
                </div>

            </section>
        </>
    )
}