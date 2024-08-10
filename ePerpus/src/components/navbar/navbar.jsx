import react from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";

export default function Navbar() {
    const [isOpen, setIsOpen] = react.useState(false);
    const [isToggleClick, setIsToggleClick] = react.useState(
    <>
        ☰
    </>
    )
    
    const toggleMenu = () => {
        setIsOpen(!isOpen);
        if (isOpen == true) {
            setIsToggleClick(
                <>
                    ☰
                </>
            )
        } else {
            setIsToggleClick(
                <>
                    <i class="fa-solid fa-xmark"></i>
                </>
            )
        }
    };

    return (
        <>
            <nav className="bg-pallet2 h-[10vh] w-full flex justify-center items-center p-5">
                <div className="container w-1/2 flex justify-center items-center">
                    <img src={logo} alt="logo TechLibrary" className="w-[8vw] mr-3"/>
                    <h1 className="font-bold tracking-widest text-2xl">TechLibrary</h1>
                </div>
                <div className="container w-1/2 hidden md:hidden lg:flex xl:flex 2xl:flex">
                    <div className="container w-full flex justify-evenly border-r-2 mr-2">
                        <Link to="/">Beranda</Link>
                        <Link to="#">Koleksi Buku</Link>
                        <Link to="#">Pustakawan</Link>
                        <Link to="#">Bantuan</Link>
                    </div>
                    <div className="container w-1/3 flex justify-evenly items-center">
                        <Link to="#">Login</Link>
                        <Link to="#">Register</Link>
                    </div>
                </div>

                <div className="container flex justify-end md:flex lg:hidden xl:hidden 2xl:hidden">
                    <button onClick={toggleMenu} className="text-xl">
                        {isToggleClick}
                    </button>
                </div>

                {isOpen && (
                    <>
                        <div className="absolute bg-pallet2 top-[9vh] h-fit w-full lg:hidden xl:hidden 2xl:hidden flex flex-col justify-center text-center z-10">
                            <div className="p-2 hover:bg-pallet1 hover:text-white">
                                <Link to="/" onClick={toggleMenu}>Beranda</Link>
                            </div>
                            <div className="p-2 hover:bg-pallet1 hover:text-white">
                                <Link to="/buku" onClick={toggleMenu}>Koleksi Buku</Link>
                            </div>
                            <div className="p-2 hover:bg-pallet1 hover:text-white">
                                <Link to="#" onClick={toggleMenu}>Pustakawan</Link>
                            </div>
                            <div className="p-2 hover:bg-pallet1 hover:text-white">
                                <Link to="#" onClick={toggleMenu}>Bantuan</Link>
                            </div>

                            <div className="p-2 hover:bg-pallet1 hover:text-white flex justify-around">
                                <Link to="#" onClick={toggleMenu}>Login</Link>
                                /
                                <Link to="#" onClick={toggleMenu}>Register</Link>
                            </div>
                        </div>
                    </>
                )}
            </nav>
        </>
    )
}