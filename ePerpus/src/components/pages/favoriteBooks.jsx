import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function FavoriteBooks() {
  const [style, setStyle] = useState("hidden")
  const id_user = window.localStorage.getItem("id_user");

  const base_url = import.meta.env.VITE_API_ENDPOINT;

  const fetch = async () => {
    const response = await axios.get(base_url + `/get/books/fav?id_user=${id_user}`);
    return response.data;
  };

  const query = useQueryClient();

  const navigate = useNavigate();

  const deleteBooks = useMutation({
    mutationFn: async (id_favorit) => {
      const response = await axios.delete(base_url + `/delete/books/fav?id_favorit=${id_favorit}`);
      return response.data;
    },
    onSuccess: (data) => {
      if (data.message === "Berhasil menghapus buku dari favorit") {
        alert("Berhasil Menghapus Buku Dari Daftar Favorit");
      } 

      query.invalidateQueries({ queryKey: ["favorite-books"] });
    },
    onError: (error) => {
      alert("Gagal Menghapus Buku Dari Daftar Favorit");
    },
  });

  const { data } = useQuery({
    queryKey: ["favorite-books"],
    queryFn: fetch,
    retry: false,
  });

  const handleDelete = (id_favorit) => {
    deleteBooks.mutate(id_favorit);
  };

  const detail = (item) => {
    navigate(`/detail/id/${item.id_buku}`, { state: { detail: item } });
  };

  return (
    <>
      <h1 className="text-center mt-1 text-xl font-bold">Favorite Books</h1>
      <section className={`p-2 ${data?.data?.length >= 3 ? "h-fit" : "h-[55vh]"}`}>
        <div className={`container ${data?.message == "Tambahkan Buku Ke Favorit" ? "flex" : "hidden"} justify-center`}>
          <h1 className="text-center mt-2">Belum Ada Buku Ditambahkan Ke Favorit</h1>
        </div>
        {data?.data?.map((item) => (
          <div className="container flex flex-row items-center border rounded-lg shadow-md p-2 mt-2" key={item.id_buku}>
            <div className="container w-[40vw] mr-3">
              <img src={item.gambar_buku} alt="Sampul Buku" className="w-full rounded-lg" />
            </div>
            <div className="container flex flex-col h-[18vh]">
              <div className="container h-1/2 flex flex-col justify-center">
                <h1>{item.judul_buku}</h1>
                <h1>{item.pengarang_buku}</h1>
                <h1 className={`${item.status == "Tersedia" ? "text-green-600" : item.status == "Dipinjam" ? "text-pallet1" : item.status == "Rusak" ? "text-red-700" : "text-green-600"}`}>{item.status}</h1>
              </div>

              <div className="container flex justify-end items-end h-1/2">
                <button onClick={() => detail(item)} type="button" className="bg-pallet2 rounded-md p-1 text-white mr-2">
                  Lihat Buku
                </button>
                <button type="button" className="bg-red-700 text-white p-1 rounded-md" onClick={() => handleDelete(item.id_favorit)}>
                  Hapus
                </button>
              </div>
            </div>
          </div>
        ))}
      </section>
    </>
  );
}
