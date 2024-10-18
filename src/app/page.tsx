"use client";
import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React from "react";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { FcGoogle } from "react-icons/fc";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { SingIn } from "@/app/SingIn";
import { useState } from "react";
import { useEffect } from "react";
import { RainbowButton } from "@/components/ui/rainbow-button";
const animalImages = [
  "https://images.unsplash.com/photo-1580281780460-82d277b0e3f8?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1553688738-a278b9f063e0?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1725409796872-8b41e8eca929?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1601758003122-53c40e686a19?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1518882174711-1de40238921b?q=80&w=1026&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
];

export default function Login() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const router = useRouter();

  const handleLogin = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/log-in", {
        // Cambiado a httpbin.org/post
        method: "POST",
        body: JSON.stringify({
          username: username,
          password: password,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data); // Esto imprimirá la respuesta simulada de httpbin.org
      } else {
        console.error("Failed to log in");
      }
    } catch (error) {
      console.error("An error occurred during login:", error);
    }
  };


  return (
    <div className="flex min-h-screen bg-black">
      {/* Contenedor principal */}
      <div className="flex flex-col md:flex-row w-full">
        {/* Formulario de Login */}
        <div className="flex flex-1 flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24 bg-black">
          <div className="flex flex-col justify-center items-center mb-6">
            <Image
              src="/petclinc.webp"
              alt="petclinic"
              width={200}
              height={200}
              className="rounded-full"
            />
            <Label className="text-2xl text-white mt-4">Pet clinic</Label>
            <p className="text-cyan-50 mt-2">Cuidamos lo que más aprecias</p>
          </div>
          <div className="grid gap-4 w-full">
            <div className="grid gap-2">
              <label className="text-cyan-50" htmlFor="email">
                Username
              </label>
              <Input
                className="text-white bg-transparent border border-cyan-50 p-2"
                id="email"
                placeholder="example"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <label className="text-cyan-50" htmlFor="password">
                Password
              </label>
              <Input
                className="text-white bg-transparent border border-cyan-50 p-2 w-full"
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <RainbowButton
              className="w-full bg-white py-2"
              onClick={() => router.push("/dashboard")}
            >
              Iniciar Sesión
            </RainbowButton>
            <Separator />
            <div className="mt-4 text-center text-sm text-cyan-50">
              Don&apos;t have an account? <SingIn />
            </div>
          </div>
        </div>

        {/* Carrusel de Imágenes (Oculto en pantallas pequeñas) */}
        <div className="hidden lg:block relative w-0 flex-1">
          <Carrusel />
        </div>
      </div>
    </div>
  );
}

export function Carrusel() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex(
        (prevIndex) => (prevIndex + 1) % animalImages.length
      );
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full h-full bg-black flex items-center justify-center">
      <div className="relative w-full h-full">
        {animalImages.map((src, index) => (
          <Image
            key={index}
            src={src}
            alt={`Animal ${index + 1}`}
            layout="fill"
            objectFit="cover"
            className={`transition-opacity duration-1000 ${index === currentImageIndex ? "opacity-100" : "opacity-0"
              }`}
          />
        ))}
      </div>
    </div>
  );
}


