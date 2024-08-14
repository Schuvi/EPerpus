import React, {useRef} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toPng } from 'html-to-image';

export default function Invoice() {
    const location = useLocation()
    const {id_buku, id_referensi, judul_buku, gambar_buku} = location.state.invoice
    const navigate = useNavigate()
    
    const username = window.localStorage.getItem("username")

    const invoiceRef = useRef(null);

    const handleDownloadImage = async () => {
      if (invoiceRef.current === null) return;
  
      try {
        const dataUrl = await toPng(invoiceRef.current);
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = 'invoice.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (error) {
        console.error('Failed to capture image', error);
      }
    };
    
    return (
        <>
            <section className="p-2 invoice" ref={invoiceRef}>
                <div className="container flex flex-col justify-center border-2 rounded-lg p-2">
                    <h1 className="text-center text-lg font-bold">Bukti Peminjaman</h1>
                    <h1 className="font-bold mt-3">No. Referensi :</h1>
                    <h1 className="text-[0.9em]">{id_referensi}</h1>
                    <h1><span className="font-bold">Nama Peminjam :</span> {username}</h1>
                    <h1 className="font-bold">Detail Buku Pinjaman :</h1>

                    <div className="container h-[30vh] flex justify-center mt-3">
                        <img src={gambar_buku} alt="Sampul Buku" className="h-full rounded-lg"/>
                    </div>
                    <h1 className="font-bold mt-2">Judul Buku :</h1>
                    <h1>{judul_buku}</h1>
                </div>
            </section>

            <div className="container mt-5">
                <h1 className="text-center font-bold">Simpan dan tunjukkan bukti peminjaman pada petugas pada saat pengambilan buku</h1>
                <div className="container text-center">
                    <button onClick={handleDownloadImage} className="border p-2 mt-2 bg-pallet1 text-white rounded-lg">
                        Download Bukti Peminjaman
                    </button>
                    <button className="border p-2 rounded-lg bg-pallet2 text-white mt-2" onClick={() => navigate("/")}>
                        Kembali Ke Halaman Awal
                    </button>
                </div>
            </div>
        </>
    )
}