import { useQuery } from "@tanstack/react-query";
import { getCoreRowModel, getPaginationRowModel, useReactTable, flexRender } from "@tanstack/react-table";
import axios from "axios";
import React, { useState } from "react";
import CreateUser from "../komponen/buatUser";
import EditUser from "../komponen/adminEditUser";
import HapusUser from "../komponen/hapusUser";
import EditStatus from "../komponen/adminEditStatusUser";

export default function UserAccount() {
  const base_url = import.meta.env.VITE_API_ENDPOINT;

  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [button, setButton] = useState(true);
  const [button1, setButton1] = useState(true);
  const [button2, setButton2] = useState(true);
  const [style, setStyle] = useState("hidden");
  const [style1, setStyle1] = useState("hidden");
  const [style2, setStyle2] = useState("hidden");
  const [tulisan1, setTulisan1] = useState("Tambah User");
  const [tulisan2, setTulisan2] = useState("Edit User");
  const [tulisan3, setTulisan3] = useState("Edit Status User");

  const tampil = () => {
    setButton(true);

    if (button) {
      setStyle("flex");
      setTulisan1("Tutup Menu");
      setButton(false);
    } else if (button === false) {
      setStyle("hidden");
      setTulisan1("Tambah User");
    }
  };

  const tampil2 = () => {
    setButton1(true);

    if (button1) {
      setStyle1("flex");
      setTulisan2("Tutup Menu");
      setButton1(false);
    } else if (button1 === false) {
      setStyle1("hidden");
      setTulisan2("Edit User");
    }
  };

  const tampil3 = () => {
    setButton2(true);

    if (button2) {
      setStyle2("flex");
      setTulisan3("Tutup Menu");
      setButton2(false);
    } else if (button2 === false) {
      setStyle2("hidden");
      setTulisan3("Edit User");
    }
  };

  const fetchUser = async ({ pageIndex, pageSize }) => {
    const response = await axios.get(base_url + "/get/user", {
      params: {
        page: pageIndex + 1,
        pageSize,
      },
    });
    return response.data;
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ["user", pageIndex, pageSize],
    queryFn: () => fetchUser({ pageIndex, pageSize }),
    keepPreviousData: true,
  });

  const userData = data ? data?.data : [];

  const filteredData = userData.filter((item) => {
    return item.nama_lengkap.toLowerCase().includes(search.toLowerCase()) || item.email.toLowerCase().includes(search.toLowerCase()) || item.id_user.toLowerCase().includes(search.toLowerCase());
  });

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
    ],
    pageCount: data ? Math.ceil(data.pagination.total / pageSize) : 0,
    state: {
      pagination: { pageIndex, pageSize },
    },
    manualPagination: true,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: (updater) => {
      const newState = typeof updater === "function" ? updater({ pageIndex, pageSize }) : updater;
      setPageSize(newState.pageSize);
      setPageIndex(newState.pageIndex);
    },
  });

  if (isLoading) return <h1>Loading...</h1>;
  if (error) return <h1>Error Loading Data</h1>;

  return (
    <>
      <h1 className="text-center font-bold text-xl mt-3 mb-5">User Akun</h1>

      <section className="p-3">
        <div className="mb-4">
          <input type="text" placeholder="Cari Buku..." value={search} onChange={(e) => setSearch(e.target.value)} className="p-2 border rounded-lg w-full" />
        </div>

        <table className="w-full mx-auto">
          <thead className="border">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="border bg-pallet1 text-white">
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="border">
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="border">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="border p-2 text-center">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <div className="container text-center flex justify-evenly mt-2">
          <button className={`${!table.getCanPreviousPage() ? "text-black" : "text-white"} border p-1 rounded-lg bg-pallet1`} onClick={() => setPageIndex((old) => Math.max(old - 1, 0))} disabled={!table.getCanPreviousPage()} type="button">
            Halaman Sebelumnya
          </button>
          <span>
            Page {pageIndex + 1} of {table.getPageCount()}
          </span>
          <button className={`${!table.getCanNextPage() ? "text-black" : "text-white"} border p-1 rounded-lg bg-pallet1`} onClick={() => setPageIndex((old) => old + 1)} disabled={!table.getCanNextPage()} type="button">
            Halaman Selanjutnya
          </button>
        </div>
        <div>
          <label>
            Show:{" "}
            <select value={pageSize} onChange={(e) => setPageSize(Number(e.target.value))}>
              {[5, 10, 20, 30, 40].map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  {pageSize}
                </option>
              ))}
            </select>
          </label>
        </div>
      </section>

      <section className="p-3">
        <h1 className="font-bold text-xl mb-3">Tambah User Baru</h1>

        <button type="button" className={`${button ? "bg-pallet1" : "bg-red-700"} text-white p-2 rounded-lg`} onClick={tampil}>
          {tulisan1}
        </button>

        <div className={`container ${style} justify-center items-center`}>
          <CreateUser />
        </div>
      </section>

      <section className="p-3">
        <h1 className="text-xl font-bold mb-3">Edit Akun User</h1>

        <button type="button" className={`${button1 ? "bg-pallet1" : "bg-red-700"} text-white p-2 rounded-lg`} onClick={tampil2}>
          {tulisan2}
        </button>

        <div className={`container ${style1} justify-center items-center`}>
          <EditUser />
        </div>
      </section>

      <section className="p-3">
        <h1 className="font-bold text-xl mb-3">Hapus User</h1>

        <HapusUser />
      </section>

      <section className="p-3">
        <h1>Edit Status User</h1>

        <button type="button" className={`${button2 ? "bg-pallet1" : "bg-red-700"} text-white p-2 rounded-lg`} onClick={tampil3}>
          {tulisan3}
        </button>
        
        <div className={`container ${style2} justify-center items-center`}>
          <EditStatus />
        </div>
      </section>
    </>
  );
}
