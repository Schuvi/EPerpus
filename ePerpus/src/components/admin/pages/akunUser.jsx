import { useQuery } from "@tanstack/react-query";
import { getCoreRowModel, getPaginationRowModel, useReactTable, flexRender } from "@tanstack/react-table";
import axios from "axios";
import React, { useState } from "react";

export default function UserAccount() {
    const base_url = import.meta.env.VITE_API_ENDPOINT

    const [pageIndex, setPageIndex] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [search, setSearch] = useState('');

    const fetchUser = async ({pageIndex, pageSize}) => {
        const response = await axios.get(base_url + "/get/user", {
            params: {
                page: pageIndex + 1, pageSize
            }
        })
        return response.data
    }

    const {data, isLoading, error} = useQuery({
        queryKey: ["user", pageIndex, pageSize],
        queryFn: () => fetchUser({pageIndex, pageSize}),
        keepPreviousData: true,
    })

    const userData = data ? data?.data : []

    const filteredData = userData.filter((item) => {
        return(
            item.nama_lengkap.toLowerCase().includes(search.toLowerCase()) ||
            item.email.toLowerCase().includes(search.toLowerCase()) || 
            item.id_user.toLowerCase().includes(search.toLowerCase())
        )
    })

    const table = useReactTable({
        data: filteredData,
        columns: [
            {
                accessorKey: "id_user", header: "ID User"
            },
            {
                accessorKey: "nama_lengkap", header: "Nama Lengkap"
            },
            {
                accessorKey: "email", header: "Email"
            }
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
            setPageSize(newState.pageSize)
            setPageIndex(newState.pageIndex)
        }
    })

    if (isLoading) return <h1>Loading...</h1>
    if (error) return <h1>Error Loading Data</h1>
    
    return(
        <>
            <h1 className="text-center font-bold text-xl mt-3 mb-5">User Akun</h1>
            
            <section className="p-3">
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
            </section>

            <section>
                <h1>Tambah User Baru</h1>

                
            </section>
        </>
    )
}