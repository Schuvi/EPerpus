import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React from "react";


export default function CardUser() {
    const base_url = import.meta.env.VITE_API_ENDPOINT
    
    const getUserPinjam = async () => {
        const response = await axios.get(base_url + "/get/user/borrow");
        console.log(response.data)
        return response.data;
    };

    const {data} = useQuery({
        queryKey: ["userPinjam"],
        queryFn: getUserPinjam,
        refetchInterval: false,
        retry: 2
    })

    return (
        <>
            <div className="flex flex-row p-2 justify-evenly overflow-x-auto w-full" data-aos = "fade-right" data-aos-once="true">
                {data?.data?.slice(0,3).map((item) => (
                    <div key={item.id_user} className="flex-shrink-0 flex flex-row shadow-lg p-2 items-center rounded-lg w-[70vw] border mb-5 mx-2 h-[20vh]">
                        <div className="container w-1/3 flex justify-center h-[12vh]">
                            <img src={item.gambar_profil} alt="Sampul Buku" className="w-[20vw] rounded-full object-cover"/>
                        </div>
                        <div className="container text-center">
                            <h1>{item.nama_lengkap}</h1>
                            <h1>Telah Meminjam : {item.banyak_meminjam} Buku</h1>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}
