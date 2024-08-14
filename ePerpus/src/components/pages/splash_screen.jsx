import React, { useEffect, useState } from "react";
import logo from "../../assets/logo.png"
import {animated, useSpring} from "@react-spring/web"

export default function Splash() {
    const [animation, setAnimation] = useState(
        {
            from: {
                opacity: 0
            },
            to: {opacity: 1}
        }
    )

    useEffect(() => {
        const timer = setTimeout(() => {
            setAnimation({from: {opacity: 1}, to: {opacity: 0}})
        }, 1000)

        return () => clearTimeout(timer)
    })
    
    const springs = useSpring(animation)
    
    return (
        <>
            <div className="flex flex-col justify-center items-center h-[100vh]">
                <div className="container flex items-center justify-center mb-5">
                    <animated.div style={{ ...springs }}>
                        <img src={logo} alt="logo perpustakaan" className="w-[30vw] md:w-[40vw]"/>
                    </animated.div>
                </div>
                <div className="container text-center">
                    <animated.div style={{ ...springs }}>
                        <h1 className="font-bold text-2xl md:text-[3.5rem]">TechLibrary</h1>
                    </animated.div>
                </div>
            </div>
        </>
    )
}