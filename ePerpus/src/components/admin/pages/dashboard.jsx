import React from "react";
import axios from "axios";
import {useQuery} from "@tanstack/react-query";
import {useReactTable, getCoreRowModel, flexRender} from "@tanstack/react-table"

export default function Dashboard() {
    const base_url = import.meta.env.VITE_API_ENDPOINT
    
    const jumlahUser = async () => {
        const response = await axios.get(base_url + "/get/user")
        return response.data
    }

    const {data} = useQuery({
        queryKey: ["jumlahUser"],
        queryFn: jumlahUser,
    })
    
    return(
        <>
            <h1 className="text-center text-2xl font-bold mt-2">Dashboard Admin</h1>

            <section className="">
                <h1>Daftar User</h1>
                {data?.data?.map((item) => (
                    <h1>{item.nama_lengkap}</h1>
                ))}
            </section>
        </>
    )
}