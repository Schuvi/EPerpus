import React, { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import gambar1 from "../../assets/gambar1.png"
import Card from "../card";
import { Carousel } from "flowbite-react";
import { Link } from "react-router-dom";
import CardAll from "../card_all";
import AOS from "aos";
import 'aos/dist/aos.css'
import { useNavigate } from "react-router-dom";
import CircularProgress, { circularProgressClasses } from '@mui/material/CircularProgress';
import CardUser from "../card_user";

export default function Home() {
    const base_url = import.meta.env.VITE_API_ENDPOINT

    const navigate = useNavigate()

    useEffect(() => {
        AOS.init()
    })

    const getBuku = async () => {
        const response = await axios.get(base_url + "/get/books/popular");
        console.log(response.data)
        return response.data;
    };

    const { data, isLoading, error, isFetching } = useQuery({
        queryKey: ["books"],
        queryFn: getBuku,
        refetchInterval: false,
        retry: 2
    });

    function GradientCircularProgress() {
        return (
          <React.Fragment>
            <svg width={0} height={0}>
              <defs>
                <linearGradient id="my_gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#e01cd5" />
                  <stop offset="100%" stopColor="#1CB5E0" />
                </linearGradient>
              </defs>
            </svg>
            <CircularProgress sx={{ 'svg circle': { stroke: 'url(#my_gradient)' } }} />
          </React.Fragment>
        );
    }

    if (isLoading || isFetching) return (
        <div className="container flex justify-center items-center h-[80vh] w-full">
            <GradientCircularProgress />
        </div>
    );
    if (error) return <div>Error: {error.message}</div>;

    return (
        <>
            <section className="flex flex-col items-center mt-1">
                <div className="h-[20vh] w-[80vw]">
                    <Carousel>
                        <img src={gambar1} alt="..." />
                        <img src={gambar1} alt="..." />
                        <img src={gambar1} alt="..." />
                        <img src={gambar1} alt="..." />
                        <img src={gambar1} alt="..." />
                    </Carousel>
                </div>
            </section>

            <section className="flex flex-row justify-evenly mt-5 p-2">
                <div className="container w-1/3 h-[10vh] flex flex-col justify-center items-center" onClick={() => {navigate("/buku")}}>
                    <i className="fa-solid fa-book text-[2em] text-pallet1"></i>
                    <h1 className="text-md text-center mt-1 tracking-tight">Buku Terbaru</h1>
                </div>
                <div className="container w-1/3 h-[10vh] flex flex-col justify-center items-center" onClick={() => {navigate("/search")}}>
                    <i className="fa-solid fa-magnifying-glass text-[2em] text-pallet1"></i>
                    <h1 className="text-md text-center mt-1 tracking-tight">Cari Buku</h1>
                </div>
                <div className="container w-1/3 h-[10vh] flex flex-col justify-center items-center">
                    <i className="fa-solid fa-bookmark text-[2em] text-pallet1"></i>
                    <h1 className="text-md text-center mt-1 tracking-tight">Favorit</h1>
                </div>
            </section>

            <section data-aos = "fade-right" data-aos-once="true">
                <div className="container flex p-3">
                    <div className="container w-full">
                        <h1 className="font-bold text-xl">Koleksi Terpopuler</h1>
                        <p className="text-sm">Koleksi yang paling banyak dipinjam</p>
                    </div>
                    <div className="container text-end w-1/3">
                        <Link to="/buku/populer" className="text-blue-500">Lihat Semua</Link>
                    </div>
                </div>

                <Card data={data.data}/>
            </section>
            
            <section className="mt-2">
                <div className="container flex p-3">
                    <div className="container w-full">
                        <h1 className="font-bold text-xl">Koleksi Terbaru</h1>
                        <p className="text-sm">Koleksi terbaru dari kami</p>
                    </div>
                    <div className="container text-end w-1/3">
                        <Link to="buku" className="text-blue-500">Lihat Semua</Link>
                    </div>
                </div>

                <CardAll/>
            </section>

            <section className="mt-2">
                <div className="container flex p-3">
                    <div className="container w-full">
                        <h1 className="font-bold text-xl">Anggota Peminjam Terbanyak</h1>
                        <p>Top 3 Peminjam Terbanyak</p>
                    </div>
                </div>

                <CardUser />
            </section>

        </>
    );
}