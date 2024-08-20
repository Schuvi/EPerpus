import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import React, { useState } from "react";
import Select from "react-select";

export default function PinjamBukuAdmin() {
    const base_url = import.meta.env.VITE_API_ENDPOINT;

    const fetch = async () => {
        const response = await axios.get(base_url + "/get/books/all");
        return response.data;
    };

    const { data } = useQuery({
        queryKey: ["pinjamBuku"],
        queryFn: fetch,
        refetchInterval: false,
    });

    const [dataForm, setDataForm] = useState({
        id_user: "",
        tanggal_pengembalian: "",
        id_buku: [{ id: "", judul: "" }],
    });

    const [durasi, setDurasi] = useState("");
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const dateNow = `${year}-${month}-${day}`;

    const pinjam = useMutation({
        mutationFn: async (formData) => {
            const response = await axios.post(base_url + "/transaction", formData, {
                headers: {
                    "Content-Type": "application/json",
                },
            });
            return response.data;
        },
        onSuccess: (data) => {
            alert("Berhasil meminjam buku");
        },
        onError: (error) => {
            alert("Gagal Meminjam Buku, Buku telah dipinjam / buku rusak");
        },
    });

    const handleChange = (selectedOption, index) => {
        const bukuList = [...dataForm.id_buku];
        bukuList[index].id = selectedOption ? selectedOption.value : "";
        bukuList[index].judul = selectedOption ? selectedOption.label : "";
        setDataForm({ ...dataForm, id_buku: bukuList });

        if (index === dataForm.id_buku.length - 1 && selectedOption) {
            setDataForm({
                ...dataForm,
                id_buku: [...dataForm.id_buku, { id: "", judul: "" }],
            });
        }
    };

    const handleDurasiChange = (e) => {
        const durasiTerpilih = parseInt(e.target.value);
        // setDurasi(durasiTerpilih);

        if (durasiTerpilih) {
            const tanggalPeminjaman = new Date(dateNow);
            tanggalPeminjaman.setDate(tanggalPeminjaman.getDate() + durasiTerpilih);
            setDataForm({
                ...dataForm,
                tanggal_pengembalian: tanggalPeminjaman.toISOString().split("T")[0],
            });
        } else {
            setDataForm({ ...dataForm, tanggal_pengembalian: "" });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = {
            id_user: dataForm.id_user,
            tanggal_peminjaman: dateNow,
            tanggal_pengembalian: dataForm.tanggal_pengembalian,
            buku_ids: dataForm.id_buku
                .filter((buku) => buku.id) // Filter out empty selects
                .map((buku) => parseInt(buku.id)), // Ensure IDs are integers
        };

        pinjam.mutate(formData);
    };

    const bookOptions = data?.data?.map((item) => ({
        value: item.id_buku,
        label: `${item.judul_buku} (ID: ${item.id_buku}) ${item.status}`,
    }));

    return (
        <>
            <h1 className="text-center mt-5 text-xl font-bold">Pinjam Buku</h1>

            <section>
                <div className="flex justify-center">
                    <form onSubmit={handleSubmit} className="flex flex-col justify-evenly w-[70vw]">
                        <label htmlFor="id_user">ID User</label>
                        <input
                            type="text"
                            id="id_user"
                            name="id_user"
                            value={dataForm.id_user}
                            onChange={(e) => setDataForm({ ...dataForm, id_user: e.target.value })}
                            required
                            className="rounded mb-3"
                        />

                        <label htmlFor="id_buku">ID Buku</label>
                        {dataForm.id_buku.map((buku, index) => (
                            <div key={index} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                <Select
                                    options={bookOptions}
                                    value={bookOptions?.find(option => option.value === buku.id)}
                                    onChange={(selectedOption) => handleChange(selectedOption, index)}
                                    isClearable
                                    placeholder="Cari atau pilih buku..."
                                    className="w-full mb-3"
                                />
                            </div>
                        ))}

                        <label htmlFor="tanggal_peminjaman">Tanggal Peminjaman</label>
                        <input
                            type="text"
                            name="tanggal_peminjaman"
                            id="tanggal_peminjaman"
                            defaultValue={dateNow}
                            required
                            disabled
                            className="mb-3 rounded bg-gray-300"
                        />

                        <label htmlFor="durasi">Durasi</label>
                        <select name="durasi" id="durasi" className="rounded mb-3" onChange={handleDurasiChange}>
                            <option value="">Pilih Durasi Peminjaman</option>
                            <option value="7">1 Minggu</option>
                            <option value="14">2 Minggu</option>
                            <option value="21">3 Minggu</option>
                            <option value="31">1 Bulan</option>
                        </select>

                        <label htmlFor="tanggal_pengembalian">Tanggal Pengembalian</label>
                        <input
                            type="text"
                            id="tanggal_pengembalian"
                            name="tanggal_pengembalian"
                            value={dataForm.tanggal_pengembalian}
                            required
                            disabled
                            className="rounded bg-gray-300 mb-3"
                        />
                        
                        <div className="text-center">
                            <button type="submit" className="border p-2 rounded bg-pallet1 text-white w-1/4">Pinjam Buku</button>
                        </div>
                    </form>
                </div>
            </section>
        </>
    );
}
