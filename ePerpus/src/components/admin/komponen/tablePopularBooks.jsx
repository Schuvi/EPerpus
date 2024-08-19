import React from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import {
    useReactTable,
    getCoreRowModel,
    flexRender
} from "@tanstack/react-table";

export default function TablePopularBooks() {
    const base_url = import.meta.env.VITE_API_ENDPOINT;

    const fetch = async () => {
        const response = await axios.get(base_url + "/get/books/popular");
        return response.data;
    };

    const { data: popularBooks, isLoading, error } = useQuery({
        queryKey: ["popularBooks"],
        queryFn: fetch,
        refetchInterval: false
    });

    const booksData = React.useMemo(() => {
        return popularBooks ? popularBooks.data : [];
    }, [popularBooks]);

    const table = useReactTable({
        data: booksData.slice(0, 5),
        columns: [
            {
                header: "Judul Buku",
                accessorKey: "judul_buku"
            },
            {
                header: "Pengarang Buku",
                accessorKey: "pengarang_buku"
            },
            {
                header: "Penerbit Buku",
                accessorKey: "penerbit_buku"
            },
            {
                header: "Tahun Terbit",
                accessorKey: "tahun_buku"
            },
            {
                header: "Total Dipinjam",
                accessorKey: "banyak_pinjaman"
            }
        ],
        getCoreRowModel: getCoreRowModel(),
    });

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error loading data</div>;

    return (
        <>
            <section className="flex flex-col">
                <table className="w-full mx-auto">
                    <thead className="border bg-pallet1 text-white">
                        {table.getHeaderGroups().map(headerGroup => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map(header => (
                                    <th key={header.id} className="border">
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
            </section>
        </>
    );
}
