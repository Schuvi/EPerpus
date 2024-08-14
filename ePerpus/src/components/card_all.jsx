import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React from "react";


export default function CardAll() {
    const base_url = import.meta.env.VITE_API_ENDPOINT
    
    const getAllBuku = async () => {
        const response = await axios.get(base_url + "/get/books");
        return response.data;
    };

    const {data} = useQuery({
        queryKey: ["buku"],
        queryFn: getAllBuku,
        refetchInterval: false,
        retry: 2
    })

    return (
        <>
            <div className="flex flex-row p-2 justify-evenly overflow-x-auto w-full" data-aos = "fade-right" data-aos-once="true">
                {data?.data?.slice(0,5).map((item) => (
                    <div key={item.id_buku} className="flex-shrink-0 flex flex-col shadow-lg items-center rounded-lg w-[45vw] p-2 border mb-5 mx-2">
                        <div className="container flex justify-center mb-3">
                            <img src={item.gambar_buku} alt="Sampul Buku" className="w-[30vw]"/>
                        </div>
                        <div className="container">
                            <h1 className="text-sm mb-3 md:text-lg">{item.pengarang_buku}</h1>
                            <h1 className="text-md mb-3 text-pallet1 md:text-2xl">{item.judul_buku}</h1>
                        </div>
                        <div className="container h-full flex flex-col justify-end">
                            <h1 className="text-sm md:text-lg">{item.penerbit_buku}</h1>
                            <h1 className={`text-sm ${item.status == "Dipinjam" ? "text-blue-500" : item.status == "Tersedia" ? "text-green-500" : item.status == "Rusak" ? "text-red-500" : "text-red-300"} md:text-lg`}>{item.status}</h1>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}
