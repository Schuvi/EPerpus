import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Search() {
  const [hasil, setHasil] = useState([]);
  const [hasil2, setHasil2] = useState({});
  const [cari, setCari] = useState("");
  const [isFilter, setFilter] = useState(true);
  const [tampil, setTampil] = useState("hidden");
  const [kategori, setKategori] = useState(false);
  const [genre, setGenre] = useState(false);
  const [isButtonCat, setIsButtonCat] = useState(false);
  const [isButtonGen, setIsButtonGen] = useState(false);
  const [styleCat, setStyleCat] = useState("bg-pallet2");
  const [styleGen, setStyleGen] = useState("bg-pallet2");
  const [style, setStyle] = useState("hidden");
  const [style1, setStyle1] = useState("hidden");
  const [styleSection, setStyleSection] = useState("h-[60vh]");
  const navigate = useNavigate();

  const base_url = import.meta.env.VITE_API_ENDPOINT;

  const handleSubmit = (e) => {
    e.preventDefault();

    let url = base_url + `/search/books?cari=${cari}`;

    if (kategori) {
      url = base_url + `/search/books/categories?cari=${cari}`;
      if (kategori == true && genre == true) {
        alert("Pilih Salah Satu Dari Filter");
      }
    } else if (genre) {
      url = base_url + `/search/books/genres?cari=${cari}`;
      if (kategori == true && genre == true) {
        alert("Pilih Salah Satu Dari Filter");
      }
    }

    axios
      .get(url)
      .then((res) => {
        console.log(res.data);
        if (res.data.data) {
          console.log(res.data.data);
          setHasil(res.data.data);
          if (res.data.data.length <= 2) {
            setStyleSection("h-[60vh]");
          } else {
            setStyleSection("h-fit");
          }
          setStyle("block");
          setStyle1("hidden");
        } else if (res.data.message) {
          setHasil2(res.data.message);
          setStyleSection("h-[60vh]");
          setStyle("hidden");
          setStyle1("block");
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  const filter = () => {
    setFilter(!isFilter);

    if (isFilter) {
      setTampil("absolute");
    } else {
      setTampil("hidden");
    }
  };

  const activeKategori = () => {
    setKategori(!kategori);
    setIsButtonCat(!isButtonCat);

    if (!kategori) {
      setStyleCat("bg-blue-500");
    } else {
      setStyleCat("bg-pallet2");
    }
  };

  const activeGenre = () => {
    setGenre(!genre);
    setIsButtonGen(!isButtonGen);

    if (!genre) {
      setStyleGen("bg-blue-500");
    } else {
      setStyleGen("bg-pallet2");
    }
  };

  const detail = (item) => {
    navigate(`/detail/id/${item.id_buku}`, { state: { detail: item } });
  };

  return (
    <>
      <section className={`${styleSection}`}>
        <form onSubmit={handleSubmit} className="p-2 w-full flex justify-center">
          <input type="search" placeholder="Cari Buku" value={cari} onChange={(e) => setCari(e.target.value)} className="w-[80vw] rounded-xl" />
          <button type="button" className="ml-2 border rounded-xl bg-pallet1 text-white h-[5.5vh] w-[13vw]" onClick={filter}>
            <i className="fa-solid fa-sliders"></i>
          </button>
          <div className={`container ${tampil} rounded-lg shadow-lg flex justify-evenly w-[90vw] h-[8vh] top-[17vh] p-2`}>
            <button type="button" className={`border rounded-lg w-[25vw] ${styleCat} text-white`} onClick={activeKategori}>
              Kategori
            </button>
            <button type="button" className={`border rounded-lg w-[25vw] ${styleGen} text-white`} onClick={activeGenre}>
              Genre
            </button>
          </div>
        </form>
        <section className={`p-2 ${style1} text-center`}>
          <h1>Buku Tidak Ditemukan</h1>
        </section>
        <section className={`p-2 lg:flex lg:flex-wrap ${style}`}>
          {hasil.map((item) => {
            return (
              <div key={item.id_buku} className="container flex flex-row p-1 border items-center rounded-lg lg:w-[47vw] lg:mr-3 lg:mb-3">
                <div className="container w-[40vw]">
                  <img src={item.gambar_buku} alt="sampul buku" className="w-full"/>
                </div>
                <div className="container ml-2">
                  <h1 className="font-bold text-xl">{item.judul_buku}</h1>
                  <h1>{item.pengarang_buku}</h1>
                  <h1 className={`${item.status == "Dipinjam" ? "text-pallet1" : item.status == "Tersedia" ? "text-green-500" : item.status == "Rusak" ? "text-red-500" : "text-pallet1"}`}>{item.status}</h1>
                  <div className="container mt-2">
                    <button className="rounded-lg border p-1 bg-pallet1 text-white w-[40vw] lg:w-[20vw]" onClick={() => detail(item)}>
                      Selengkapnya
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </section>
      </section>
    </>
  );
}
