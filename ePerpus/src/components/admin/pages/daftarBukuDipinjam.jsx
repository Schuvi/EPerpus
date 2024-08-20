import { useQuery } from "@tanstack/react-query";
import { getCoreRowModel, getPaginationRowModel, useReactTable, flexRender } from "@tanstack/react-table";
import axios from "axios";
import React, { useState } from "react";

export default function DaftarBukuDipinjam() {
    const base_url = import.meta.env.VITE_API_ENDPOINT

    const [pageIndex, setPageIndex] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [search, setSearch] = useState('')

    const fetchBooks = async ({pageIndex, pageSize}) => {
        const response = await axios.get(base_url + "/get/books/borrowed", {
            params: {page: pageIndex + 1, pageSize}
        })
        return response.data
    }

    const {data, isLoading, error} = useQuery({
        queryKey: ['list-books', pageIndex, pageSize],
        queryFn: () => fetchBooks({pageIndex, pageSize}),
        keepPreviousData: true,
    })

    const booksData = data ? data.data : []

    const filteredData = booksData.filter((item) => {
        return (
            item.judul_buku.toLowerCase().includes(search.toLowerCase()) ||
            item.nama_lengkap.toLowerCase().includes(search.toLowerCase()) ||
            item.tanggal_meminjam.toString().includes(search) 
        )
    })

    const table = useReactTable({
        data: filteredData,
        columns: [
            {accessorKey: "id_pinjaman", header: "ID Pinjam"},
            {accessorKey: "nama_lengkap", header: "Nama Peminjam"},
            {accessorKey: "judul_buku", header: "Judul Buku"},
            {accessorKey: "tanggal_meminjam", header: "Tanggal Meminjam"},
            {
                accessorKey: "tanggal_mengembalikan",
                header: "Tanggal Mengembalikan",
                cell: info => {
                    const today = new Date();
                    const returnDate = new Date(info.getValue());
                    const isLate = returnDate < today;

                    return (
                        <span style={{ color: isLate ? 'red' : 'black' }}>
                            {info.getValue()}
                        </span>
                    );
                }
            },
        ],
        pageCount: data ? Math.ceil(data.pagination.total / pageSize) : 0,
        state: {
            pagination: {pageIndex, pageSize}
        },
        manualPagination: true,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onPaginationChange: (updater) => {
            const newState = typeof updater === "function" ? updater({pageIndex, pageSize}) : updater
            setPageIndex(newState.pageIndex)
            setPageSize(newState.pageSize)
        }
    })

    if (isLoading) return <h1>Loading..</h1>
    if (error) return <h1>error mengambil data</h1>
    
    return(
        <>
            <section className="p-3">
                <h1 className="text-center font-bold text-2xl mb-5">Daftar Buku Pinjaman</h1>

                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="Cari Buku..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
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

                <div className="container mt-5">
                    <h1 className="font-bold text-xl">Note :</h1>

                    <ol className="ml-5">
                        <li className="before:content-['#'] before:font-bold before:mr-1">Warna tanggal berubah menjadi <span className="text-red-600">merah</span> = <span className="text-red-600 font-bold">Terkena Denda</span></li>
                    </ol>
                </div>
            </section>
        </>
    )
}