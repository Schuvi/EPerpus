import React, { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import Select from "react-select";

export default function KembalikanBukuAdmin() {
    const base_url = import.meta.env.VITE_API_ENDPOINT;

    const [form, setForm] = useState({
        id_buku: 0,
        id_pinjaman: 0
    });

    const fetch = async () => {
        const response = await axios.get(base_url + "/get/books/borrowed");
        return response.data;
    };

    const { data } = useQuery({
        queryKey: ["adminKembaliBuku"],
        queryFn: fetch,
        refetchInterval: false,
    });

    const bukuKembali = useMutation({
        mutationFn: async (formData) => {
            const response = await axios.put(base_url + `/return/books?id_buku=${formData.id_buku}&id_pinjaman=${formData.id_pinjaman}`, {
                headers: {
                    "Content-Type": "application/json",
                },
            });

            return response.data;
        },
        onSuccess: () => {
            alert("Berhasil Mengembalikan Buku");
        },
        onError: () => {
            alert("Gagal Mengembalikan Buku");
        }
    });

    const handleBukuChange = (selectedOption) => {
        const selectedBook = data?.data?.find(item => item.id_buku === selectedOption.value);

        setForm({
            ...form,
            id_buku: selectedOption ? selectedOption.value : 0,
            id_pinjaman: selectedBook ? selectedBook.id_pinjaman : 0
        });
    };

    const handlePinjamanChange = (selectedOption) => {
        setForm({
            ...form,
            id_pinjaman: selectedOption ? selectedOption.value : 0
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = {
            id_buku: form.id_buku,
            id_pinjaman: form.id_pinjaman
        };

        bukuKembali.mutate(formData);
    };

    const bookOptions = data?.data?.map((item) => ({
        value: item.id_buku,
        label: `${item.id_buku} - ${item.judul_buku}`
    }));

    const pinjamOptions = data?.data
        ?.filter((item) => item.id_buku === form.id_buku)
        .map((item) => ({
            value: item.id_pinjaman,
            label: `${item.id_pinjaman} - ${item.judul_buku}`
        }));

    return (
        <>
            <section className="flex flex-col justify-center items-center">
                <h1 className="mt-3 text-xl font-bold">Pengembalian Buku</h1>

                <form onSubmit={handleSubmit} className="w-[80vw] h-[46vh] mt-3">
                    <label htmlFor="id_buku">ID Buku</label>
                    <Select
                        options={bookOptions}
                        value={bookOptions?.find(option => option.value === form.id_buku)}
                        onChange={handleBukuChange}
                        isClearable
                        placeholder="Cari ID Buku"
                        className="mb-5"
                    />
                    
                    <label htmlFor="id_pinjam">ID Pinjam</label>
                    <Select
                        options={pinjamOptions}
                        value={pinjamOptions?.find(option => option.value === form.id_pinjaman)}
                        onChange={handlePinjamanChange}
                        isClearable
                        placeholder="Cari ID Pinjam"
                        className="mb-5"
                    />
                    
                    <div className="text-center">
                        <button type="submit" className="border p-2 rounded-xl bg-pallet1 text-white">Kembalikan Buku</button>
                    </div>
                </form>
            </section>
        </>
    );
}
