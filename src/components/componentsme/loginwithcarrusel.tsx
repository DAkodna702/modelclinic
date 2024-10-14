"use client";
import React from "react";
import { Carrusel } from "./Carrusel";
import { Login } from "./Login";

export function MainLayout() {
    return (
        <div className="h-screen flex">
            <div className="w-[70%]">
                <Carrusel />
            </div>
            <div className="w-[30%] flex flex-col   bg-black">
                <Login />
            </div>
        </div>
    );
}

