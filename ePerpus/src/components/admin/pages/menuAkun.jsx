import React from "react";
import { useNavigate } from "react-router-dom";

export default function MenuAkun() {
    const navigate = useNavigate()
    
    return (
        <>
            <section className="h-[50vh]">
                <h1 className="text-center mt-5 text-2xl font-bold">Menu User</h1>
                
                <div className="h-full flex flex-row items-center justify-evenly">
                    <div className="container w-1/4 border h-[20vh] flex flex-col items-center justify-center rounded-lg bg-pallet1 hover:shadow-xl cursor-pointer hover:cursor-pointer hover:-translate-y-2 hover:transition-all" onClick={() => navigate("/admin/akun/user")}>
                        <i className="fa-solid fa-user text-[2.5em] text-white"></i>
                        <h1 className="text-xl text-white">Akun User</h1>
                    </div>
                    <div className="container w-1/4 border h-[20vh] flex flex-col items-center justify-center rounded-lg bg-pallet1 hover:shadow-xl cursor-pointer hover:cursor-pointer hover:-translate-y-2 hover:transition-all" onClick={() => navigate("/admin/akun/admin")}>
                        <i className="fa-solid fa-hashtag text-[2.5em] text-white"></i>
                        <h1 className="text-xl text-white">Akun Admin</h1>
                    </div>
                </div>
            </section>
        </>
    )
}