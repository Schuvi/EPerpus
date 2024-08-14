import React from "react";
import {useQuery} from "@tanstack/react-query"
import axios from "axios";
import { useNavigate } from "react-router-dom";
import picture from "/user/1723078736190-blank_profile.png"
 
export default function Profile() {
    const id_user = window.localStorage.getItem("id_user")

    const navigate = useNavigate()

    const base_url = import.meta.env.VITE_API_ENDPOINT

    const fetchProfile = async () => {
        const response = await axios.get(base_url + `/get/user/id?id_user=${id_user}`)
        console.log(response.data)
        return response.data
    }

    const {data} = useQuery({
        queryKey: ["user_data"],
        queryFn: fetchProfile,
        retry: false
    });
    
    return (
        <>
            <section className="h-[60vh] flex flex-col">
                <h1 className="text-center font-bold text-xl mt-5">Pengaturan Profile</h1>

                <div className="flex flex-col p-2 mt-2">
                    {data?.data?.map((item) => (
                        <>
                            <div className="container flex justify-center">
                                <div className="container h-[14vh] w-[30vw]">
                                    <img src={item.gambar_profil == null ? picture : item.gambar_profil} alt="Foto Profile" className="h-full w-full rounded-full object-cover" />
                                </div>
                            </div>
                            <div className="container text-center mt-2" onClick={() => navigate("/profile/edit", {state: {edit: item}})}>
                                <h1><i className="fa-solid fa-pen mr-1 mt-2"></i> Edit Profile</h1>
                            </div>
                            <div className="container">
                                <h1 className="font-bold">User ID :</h1>
                                <h1>{item.id_user}</h1>

                                <h1 className="font-bold">Nama Lengkap : </h1>
                                <h1>{item.nama_lengkap}</h1>

                                <h1 className="font-bold">Email :</h1>
                                <h1>{item.email}</h1>
                            </div>
                        </>
                    ))}

                    <div className="container text-center mt-5">
                        <button className="border p-2 rounded-lg bg-pallet1 text-white" onClick={() => navigate("/")}>
                            Kembali Ke Beranda
                        </button>
                    </div>
                    
                </div>
            </section>
        </>
    )
}