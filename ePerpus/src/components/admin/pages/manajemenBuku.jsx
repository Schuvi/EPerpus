import React, { useState } from "react";
import axios from "axios";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useReactTable, getCoreRowModel, getPaginationRowModel, flexRender } from "@tanstack/react-table";
import HapusBuku from "../komponen/hapusBuku";

export default function ManajemenBuku() {
    const base_url = import.meta.env.VITE_API_ENDPOINT;

    const [pageIndex, setPageIndex] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [searchQuery, setSearchQuery] = useState("");
    const [createBooks, setCreateBooks] = useState("hidden");
    const [tampil, setTampil] = useState(true);

    const getBuku = async ({ pageIndex, pageSize }) => {
        const response = await axios.get(base_url + "/get/books", {
            params: { page: pageIndex + 1, pageSize }
        });
        return response.data;
    };

    const { data, isLoading, error } = useQuery({
        queryKey: ['getBooks', pageIndex, pageSize],
        queryFn: () => getBuku({ pageIndex, pageSize }),
        keepPreviousData: true,
    });

    const fixData = data ? data.data : [];

    const filteredData = fixData.filter((item) => {
        return (
            item.judul_buku.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.pengarang_buku.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.penerbit_buku.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.tahun_buku.toString().includes(searchQuery) ||
            item.status.toLowerCase().includes(searchQuery.toLowerCase())
        );
    });

    const table = useReactTable({
        data: filteredData,
        columns: [
            { accessorKey: "id_buku", header: "ID Buku" },
            { accessorKey: "judul_buku", header: "Judul Buku" },
            { accessorKey: "pengarang_buku", header: "Pengarang Buku" },
            { accessorKey: "penerbit_buku", header: "Penerbit Buku" },
            { accessorKey: "tahun_buku", header: "Tahun Terbit" },
            { accessorKey: "gambar_buku", header: "Gambar Buku" },
            { accessorKey: "file_buku", header: "Link Baca Buku" },
            { accessorKey: "status", header: "Status Buku" },
        ],
        pageCount: data ? Math.ceil(data.total / pageSize) : 0,
        state: { pagination: { pageIndex, pageSize } },
        manualPagination: true,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onPaginationChange: (updater) => {
            const newState = typeof updater === "function" ? updater({ pageIndex, pageSize }) : updater;
            setPageIndex(newState.pageIndex);
            setPageSize(newState.pageSize);
        },
    });

    const [create, setCreate] = useState({
        id_buku: 0,
        judul_buku: "",
        pengarang_buku: "",
        penerbit_buku: "",
        tahun_buku: 0,
        status_buku: 0,
        deskripsi_buku: "",
        kategori_buku: 0,
        genre: [],
        file_buku: "",
        banyak_pinjaman: 0,
        gambar_buku: null
    })

    const tambah = useMutation({
        mutationFn: async (formData) => {
            const response = await axios.post(`${base_url}/create/books`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });

            return response.data
        },
        onSuccess: (data) => {
            alert("Berhasil Menambahkan Buku")
        },
        onError: (error) => {
            alert(error)
        }
    })

    const edit = useMutation({
        mutationFn: async (formData) => {
            const response = await axios.put(`${base_url}/edit/books`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });

            return response.data
        },
        onSuccess: (data) => {
            alert("Berhasil Mengedit Buku")
        },
        onError: (error) => {
            alert(error)
        }
    })

    const handleSubmit = (e) => {
        e.preventDefault()

        const formData = new FormData()
        formData.append("judul_buku", create.judul_buku)
        formData.append("pengarang_buku", create.pengarang_buku)
        formData.append("penerbit_buku", create.penerbit_buku)
        formData.append("tahun_buku", create.tahun_buku)
        formData.append("status_buku", create.status_buku)
        formData.append("deskripsi_buku", create.deskripsi_buku)
        formData.append("kategori_buku", create.kategori_buku)
        formData.append("genre", create.genre)
        formData.append("file_buku", create.file_buku)
        formData.append("banyak_pinjaman", create.banyak_pinjaman)
        formData.append("gambar_buku", create.gambar_buku)

        tambah.mutate(formData)
    }

    const handleEdit = (e) => {
        e.preventDefault()

        const formData = new FormData()
        formData.append("judul_buku", create.judul_buku)
        formData.append("pengarang_buku", create.pengarang_buku)
        formData.append("penerbit_buku", create.penerbit_buku)
        formData.append("tahun_buku", create.tahun_buku)
        formData.append("status_buku", create.status_buku)
        formData.append("deskripsi_buku", create.deskripsi_buku)
        formData.append("kategori_buku", create.kategori_buku)
        formData.append("genre", create.genre)
        formData.append("file_buku", create.file_buku)
        formData.append("banyak_pinjaman", create.banyak_pinjaman)
        formData.append("gambar_buku", create.gambar_buku)

        edit.mutate(formData)
    }

    const handleChange = (e) => {
        const {name, value, type, files} = e.target

        if (type === "file") {
            console.log("Selected file:", files[0])
            setCreate((prevData) => ({
                ...prevData,
                [name]: files[0]
            }));
        } else {
            setCreate((prevData) => ({
                ...prevData,
                [name]: value
            }))
        }
    }

    const handleGenreChange = (e) => {
        const { value, checked } = e.target;
        setCreate((prevState) => {
          if (checked) {
            return { ...prevState, genre: [...prevState.genre, value] };
          } else {
            return { ...prevState, genre: prevState.genre.filter((g) => g !== value) };
          }
        });
    };

    const tampilCreateBuku = () => {
        setTampil(true)
        setCreateBooks("block")
    }

    const hiddenCreateBuku = () => {
        setTampil(false)
        setCreateBooks("hidden")
    }

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error loading data</div>;

    return (
        <>
            <h1 className="text-center text-2xl mt-2 font-bold mb-2">Manajemen Buku</h1>

            <section className="p-3">
                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="Cari Buku..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="p-2 border rounded-lg w-full"
                    />
                </div>

                <table className="w-full mx-auto">
                    <thead className="border">
                        {table.getHeaderGroups().map(headerGroup => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map(header => (
                                    <th key={header.id} className="border bg-pallet1 text-white">
                                        {flexRender(
                                            header.column.columnDef.header,
                                            header.getContext()
                                        )}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody className="border">
                        {table.getRowModel().rows.map(row => (
                            <tr key={row.id} className="border">
                                {row.getVisibleCells().map(cell => (
                                    <td key={cell.id} className="border p-2 text-center">
                                        {flexRender(
                                            cell.column.columnDef.cell,
                                            cell.getContext()
                                        )}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="container text-center flex justify-evenly mt-2">
                    <button 
                        className={`${!table.getCanPreviousPage() ? "text-black" : "text-white"} border p-1 rounded-lg bg-pallet1`} 
                        onClick={() => setPageIndex(old => Math.max(old - 1, 0))}
                        disabled={!table.getCanPreviousPage()}
                        type="button">
                        Halaman Sebelumnya
                    </button>
                    <span>
                        Page {pageIndex + 1} of {table.getPageCount()}
                    </span>
                    <button 
                        className={`${!table.getCanNextPage() ? "text-black" : "text-white"} border p-1 rounded-lg bg-pallet1`} 
                        onClick={() => setPageIndex(old => old + 1)}
                        disabled={!table.getCanNextPage()}
                        type="button">
                        Halaman Selanjutnya
                    </button>
                </div>
                <div>
                    <label>
                        Show:{" "}
                        <select
                            value={pageSize}
                            onChange={e => setPageSize(Number(e.target.value))}
                        >
                            {[5, 10, 20, 30, 40].map(pageSize => (
                                <option key={pageSize} value={pageSize}>
                                    {pageSize}
                                </option>
                            ))}
                        </select>
                    </label>
                </div>
            </section>

            <section className="p-3">
                <h1 className="text-xl font-bold mb-2">Hapus Buku</h1>
                <HapusBuku />
            </section>

            <section className={`p-3 overflow-hidden`}>
                <h1>Tambah Buku</h1>
                <button type="button" className="border p-2 rounded-lg bg-pallet1 text-white" onClick={tampilCreateBuku}>
                    Buat Buku
                </button>
                
                <div className={`${createBooks} justify-center`}>
                    <form className="flex flex-col rounded-lg bg-white w-[97vw] h-full p-3 items-center justify-center" onSubmit={handleSubmit}>
                        <div className="container flex flex-row justify-evenly">
                            <div className="container w-1/3 flex flex-col">
                                <label htmlFor="judul_buku">Judul Buku</label>
                                <input className="rounded-xl" type="text" name="judul_buku" id="judul_buku" placeholder="Masukkan Judul Buku" value={create.judul_buku} onChange={handleChange}/>

                                <label className="mt-3" htmlFor="pengarang_buku">Pengarang Buku</label>
                                <input className="rounded-xl" type="text" name="pengarang_buku" id="pengarang_buku" placeholder="Masukkan Pengarang Buku" value={create.pengarang_buku} onChange={handleChange}/>

                                <label className="mt-3" htmlFor="penerbit_buku">Penerbit Buku</label>
                                <input className="rounded-xl" type="text" name="penerbit_buku" id="penerbit_buku" placeholder="Masukkan Penerbit Buku" value={create.penerbit_buku} onChange={handleChange}/>

                                <label className="mt-3" htmlFor="tahun_buku">Tahun Terbit Buku</label>
                                <input className="rounded-xl" type="number" name="tahun_buku" id="tahun_buku" placeholder="Masukkan Tahun Buku" value={create.tahun_buku} onChange={handleChange}/>

                                <input className="rounded-xl" type="number" name="status_buku" id="status_buku" value={create.status_buku} onChange={handleChange} hidden/>
                                
                                <label className="mt-3" htmlFor="deskripsi_buku">Deskripsi Buku</label>
                                <textarea className="rounded-xl" name="deskripsi_buku" id="deskripsi_buku" placeholder="Masukkan Deskripsi Buku" value={create.deskripsi_buku} onChange={handleChange}></textarea>
                            </div>

                            <div className="container w-1/3 flex flex-col">
                                <label className="mt-3" htmlFor="kategori_buku">Kategori Buku</label>
                                <select className="rounded-xl" name="kategori_buku" id="kategori_buku" value={create.kategori_buku} onChange={handleChange}>
                                    <option value="">Pilih Kategori Buku</option>
                                    <option value="1">Novel</option>
                                    <option value="2">Cerita Bergambar</option>
                                    <option value="3">Komik</option>
                                    <option value="4">Ensiklopedia</option>
                                    <option value="5">Antologi</option>
                                    <option value="6">Biografi</option>
                                    <option value="7">Karya Ilmiah</option>
                                    <option value="8">Kamus</option>
                                    <option value="9">Majalah</option>
                                    <option value="10">Biografi</option>
                                </select>
                                
                                <label className="mt-3" htmlFor="genre">Genre</label>

                                <div className="container flex flex-col flex-wrap">
                                    <div className="container flex justify-evenly">
                                        <input type="checkbox" name="genre" id="romance" value={1} onChange={handleGenreChange}/>
                                        <label htmlFor="romance" className="-mt-1">Romance</label>
                                        <input type="checkbox" name="genre" id="scifi" value={2} onChange={handleGenreChange}/>
                                        <label htmlFor="scifi" className="-mt-1">Science Fiction</label>
                                        <input type="checkbox" name="genre" id="fantasi" value={3} onChange={handleGenreChange}/>
                                        <label htmlFor="fantasi" className="-mt-1">Fantasi</label>
                                        <input type="checkbox" name="genre" id="misteri" value={4} onChange={handleGenreChange}/>
                                        <label htmlFor="misteri" className="-mt-1">Misteri</label>
                                        <input type="checkbox" name="genre" id="thriller" value={5} onChange={handleGenreChange}/>
                                        <label htmlFor="thriller" className="-mt-1">Thriller</label>
                                    </div>

                                    <div className="container flex justify-evenly mt-5">
                                        <input type="checkbox" name="genre" id="histori" value={6} onChange={handleGenreChange}/>
                                        <label htmlFor="histori" className="-mt-1">Historical</label>
                                        <input type="checkbox" name="genre" id="horror" value={7} onChange={handleGenreChange}/>
                                        <label htmlFor="horror" className="-mt-1">Horror</label>
                                        <input type="checkbox" name="genre" id="sol" value={8} onChange={handleGenreChange}/>
                                        <label htmlFor="sol" className="-mt-1">Slice of Life</label>
                                        <input type="checkbox" name="genre" id="motivasi" value={9} onChange={handleGenreChange}/>
                                        <label htmlFor="motivasi" className="-mt-1">Motivasi</label>
                                        <input type="checkbox" name="genre" id="jurnalisme" value={10} onChange={handleGenreChange}/>
                                        <label htmlFor="jurnalisme" className="-mt-1">Jurnalisme</label>
                                    </div>
                                </div>

                                <label htmlFor="gambar_buku" className="mt-3">Gambar Buku</label>
                                <input type="file" name="gambar_buku" id="gambar_buku" className="border rounded-xl" onChange={handleChange} required/>
                                
                                <label className="mt-3" htmlFor="file_buku">URL Baca Buku Online</label>
                                <input className="rounded-xl" type="text" name="file_buku" id="file_buku" placeholder="Masukkan URL Online Pub5HTML" value={create.file_buku} onChange={handleChange}/>

                                <input type="text" name="banyak_pinjaman" id="banyak_pinjaman" value={create.banyak_pinjaman} hidden/>
                            </div>
                        </div>


                        <div className="container flex flex-col mt-5 justify-center items-center">
                            <button type="submit" className="border rounded-lg p-2 w-1/4 bg-pallet1 text-white">Tambah Buku</button>
                            <button type="button" className="border rounded-lg p-2 w-1/4 bg-pallet1 mt-2 text-white" onClick={hiddenCreateBuku}>
                                Tutup Menu
                            </button>
                        </div>
                    </form>
                </div>
            </section>

            <section>

            </section>
        </>
    );
}
