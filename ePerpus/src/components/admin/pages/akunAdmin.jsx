import React, { useState } from "react";
import TableAdmin from "../komponen/adminTable";
import CreateAdmin from "../komponen/buatAdmin";
import EditAdmin from "../komponen/adminEditAdmin";
import HapusAdmin from "../komponen/hapusAdmin";

export default function AdminAccount() {
    const [button1, setButton1] = useState(true)
    const [style1, setStyle1] = useState("hidden")
    const [tulisan1, setTulisan1] = useState("Tambah Admin")
    const [button2, setButton2] = useState(true)
    const [style2, setStyle2] = useState("hidden")
    const [tulisan2, setTulisan2] = useState("Edit Admin")

    const tampil1 = () => {
        setButton1(true)

        if (button1) {
            setStyle1("flex")
            setTulisan1("Tutup Menu")
            setButton1(false)
        } else {
            setStyle1("hidden")
            setTulisan1("Tambah Admin")
        }
    }
    
    const tampil2 = () => {
        setButton2(true)

        if (button2) {
            setStyle2("flex")
            setTulisan2("Tutup Menu")
            setButton2(false)
        } else {
            setStyle2("hidden")
            setTulisan2("Tambah Admin")
        }
    }
    
    return(
        <>
            <h1 className="text-center text-xl font-bold mt-3 mb-5">Akun Admin</h1>
            
            <section className="p-3">
                <TableAdmin />
            </section>

            <section className="p-3">
                <h1 className="font-bold text-xl mb-3">Tambah Admin</h1>
                
                <button type="button" className={`border p-2 rounded-lg ${button1 ? "bg-pallet1" : "bg-red-700"} text-white`} onClick={tampil1}>
                    {tulisan1}
                </button>

                <div className={`${style1} justify-center`}>
                    <CreateAdmin />
                </div>
            </section>

            <section className="p-3">
                <h1 className="font-bold text-xl mb-3">Edit Admin</h1>

                <button type="button" className={`border p-2 rounded-lg ${button2 ? "bg-pallet1" : "bg-red-700"} text-white`} onClick={tampil2}>
                    {tulisan2}
                </button>

                <div className={`${style2} justify-center`}>
                    <EditAdmin />
                </div>
            </section>

            <section className="p-3">
                <h1 className="text-xl font-bold mb-3">Hapus Admin</h1>

                <HapusAdmin />
            </section>
        </>
    )
}