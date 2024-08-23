import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";

export default function Employee() {
    const [style, setStyle] = useState("h-[60vh]")

    const base_url = import.meta.env.VITE_API_ENDPOINT

    const fetch = async () => {
        const response = await axios.get(base_url + "/get/admin")
        return response.data
    }

    const {data} = useQuery({
        queryKey: ["employee"],
        queryFn: fetch,
        retry: false
    })

    return (
        <>
            <h1 className="text-center text-xl font-bold mt-2">Daftar Pustakawan</h1>
            <section className="lg:flex lg:flex-wrap">
                <div className={`p-3 lg:w-[48vw]`}>
                    {data?.data?.map((item) => (
                        <div key={item.id_user} className="container flex border p-2 rounded-lg shadow-md">
                            <div className="container h-[20vh] w-[40vw] mr-3">
                                <img src={item.gambar_profil} alt="" className="h-full rounded-lg object-cover"/>
                            </div>
                            <div className="container">
                                <h1 className="font-bold">Nama Lengkap :</h1>
                                <h1>{item.nama_lengkap}</h1>
                                <h1 className="font-bold">Email :</h1>
                                <h1>{item.email}</h1>
                                <h1 className="font-bold">Role :</h1>
                                <h1>Pustakawan</h1>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </>
        
    )
}