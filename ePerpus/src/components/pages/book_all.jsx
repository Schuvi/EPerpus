import React, {useState} from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function BookAll() {
    const base_url = import.meta.env.VITE_API_ENDPOINT

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const navigate = useNavigate()

    const getAllBuku = async () => {
        const response = await axios.get(base_url + "/get/books");
        return response.data;
    };

    const { data, isLoading, isError } = useQuery({
        queryKey: ["buku"],
        queryFn: getAllBuku,
        refetchInterval: false,
        retry: 2
    });

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (isError) {
        return <div>Error loading data.</div>;
    }

    const detail = (item) => {
        navigate(`/detail/id/${item.id_buku}`, {state: {detail: item}})
    }

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = data?.data?.slice(indexOfFirstItem, indexOfLastItem);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <>
            <div className="container text-center">
                <h1 className="text-2xl font-bold mb-2 mt-5">Daftar Semua Buku</h1>
                <button className="border w-[20vw] rounded-lg bg-pallet1 text-white mb-5" onClick={() => navigate("/search")}>
                    Cari Buku
                </button>
            </div>
            <div className="flex flex-row flex-wrap p-2 justify-center w-full">
                {currentItems && currentItems.map((item) => (
                    <div key={item.id_buku} className="container flex flex-col shadow-lg items-center rounded-lg w-[40vw] p-2 border mb-5 mx-2" onClick={() => detail(item)}>
                        <div className="container flex justify-center mb-3">
                            <img src={item.gambar_buku} alt="Sampul Buku" className="w-[30vw]"/>
                        </div>
                        <div className="container">
                            <h1 className="text-sm mb-3">{item.pengarang_buku}</h1>
                            <h1 className="text-md mb-3 text-pallet1">{item.judul_buku}</h1>
                        </div>
                        <div className="container h-full flex flex-col justify-end">
                            <h1 className="text-sm">{item.penerbit_buku}</h1>
                            <h1 className={`text-sm ${item.status == "Dipinjam" ? "text-blue-500" : item.status == "Tersedia" ? "text-green-500" : item.status == "Rusak" ? "text-red-500" : "text-red-300"}`}>{item.status}</h1>
                        </div>
                    </div>
                ))}
            </div>
            <div className="container text-center pagination">
              {[...Array(Math.ceil(data?.data?.length / itemsPerPage)).keys()].map((number) => (
                <button key={number + 1} onClick={() => paginate(number + 1)} className={`m-2 ${currentPage === number + 1 ? "text-pallet2" : "text-black"}`}>
                  {number + 1}
                </button>
              ))}
            </div>
        </>
    )
}