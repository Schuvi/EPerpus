import React, { useState } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import {
    useReactTable,
    getCoreRowModel,
    getPaginationRowModel,
    flexRender
} from "@tanstack/react-table";
import TablePopularBooks from "../komponen/tablePopularBooks";

export default function Dashboard() {
    const base_url = import.meta.env.VITE_API_ENDPOINT;
    
    const [statusFilter, setStatusFilter] = useState("");
    const [pageIndex, setPageIndex] = useState(0);
    const [pageSize, setPageSize] = useState(5);

    const jumlahUser = async () => {
        const response = await axios.get(base_url + "/get/user");
        return response.data;
    };

    const { data } = useQuery({
        queryKey: ["jumlahUser"],
        queryFn: jumlahUser,
        refetchInterval: 5000,
    });

    const filteredData = React.useMemo(() => {
        if (!data) return [];
        return statusFilter === ""
            ? data.data
            : data.data.filter((user) => user.status_user === statusFilter);
    }, [data, statusFilter]);

    const table = useReactTable({
        data: filteredData,
        columns: [
            {
                accessorKey: "id_user",
                header: "ID User",
            },
            {
                accessorKey: "nama_lengkap",
                header: "Nama Lengkap",
            },
            {
                accessorKey: "email",
                header: "Email",
            },
            {
                accessorKey: "status_user",
                header: "Status",
            },
        ],
        pageCount: Math.ceil(filteredData.length / pageSize),
        state: {
            pagination: { pageIndex, pageSize },
        },
        manualPagination: false,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onPaginationChange: (updater) => {
            const newState =
                typeof updater === "function"
                    ? updater({ pageIndex, pageSize })
                    : updater;
            setPageIndex(newState.pageIndex);
            setPageSize(newState.pageSize);
        },
    });

    return (
        <>
            <h1 className="text-center text-2xl font-bold mt-2">Dashboard Admin</h1>

            <section className="flex flex-col p-3">
                <h1 className="text-start text-xl font-bold mb-2 before:content-['#'] before:mr-2">Daftar User</h1>
                <div className="mb-2">
                    <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="rounded-lg">
                        <option value="">Semua Status</option>
                        <option value="Aktif">Aktif</option>
                        <option value="Non Aktif">Non Aktif</option>
                        <option value="Undefined">Undefined</option>
                        <option value="Blokir">Blokir</option>
                    </select>
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
                    <button className={`${!table.getCanPreviousPage() ? "text-black" : "text-white"} border p-1 rounded-lg bg-pallet1`} onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
                        Halaman Sebelumnya
                    </button>
                    <span>
                        Page {pageIndex + 1} of {table.getPageCount()}
                    </span>
                    <button className={`${!table.getCanNextPage() ? "text-black" : "text-white"} border p-1 rounded-lg bg-pallet1`} onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
                        Halaman Selanjutnya
                    </button>
                </div>
                <div>
                    <label>
                        Show:{" "}
                        <select
                            value={pageSize}
                            onChange={(e) => setPageSize(Number(e.target.value))}
                            className="rounded-lg"
                        >
                            {[5, 10, 20].map((size) => (
                                <option key={size} value={size}>
                                    {size}
                                </option>
                            ))}
                        </select>
                    </label>
                </div>
                <div className="container">
                    <h1 className="font-bold text-lg mt-2">Note :</h1>
                    <ol>
                        <li className="before:content-['#'] before:mr-2 before:ml-4">
                            <span className="font-bold">Aktif</span> : User telah Login namun bisa saja belum logout
                        </li>
                        <li className="before:content-['#'] before:mr-2 before:ml-4">
                            <span className="font-bold">Non Aktif</span> : User telah logout
                        </li>
                        <li className="before:content-['#'] before:mr-2 before:ml-4">
                            <span className="font-bold">Undefined</span> : User telah melakukan register, namun belum pernah melakukan Login
                        </li>
                        <li className="before:content-['#'] before:mr-2 before:ml-4">
                            <span className="font-bold">Blokir</span> : User telah diblokir dan tidak bisa menggunakan Akun
                        </li>
                    </ol>
                </div>
            </section>

            <section className="mt-2 p-3">
                <h1 className="text-start text-xl font-bold mb-2 before:content-['#'] before:mr-2">Data 5 Buku Terpopuler</h1>

                <TablePopularBooks />

            </section>
        </>
    );
}
