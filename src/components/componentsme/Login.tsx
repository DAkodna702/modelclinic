"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React from "react";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { FcGoogle } from "react-icons/fc";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { SingIn } from "./SingIn";
import { useState } from "react";

export function Login() {
  const [username, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    const response = await fetch("http://localhost:8080/api/log-in", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username: username, password }),
    });

    if (response.ok) {
      const data = await response.json();
      console.log(data);
      // Check if login was successful and redirect
      if (data.status) {
        router.push("/dashboard");
      } else {
        console.error("Login failed:", data.message);
      }
    } else {
      console.error("Failed to log in");
    }
  };

  const { data: session } = useSession();
  console.log(session);

  return (
    <Card className=" h-full w-full max-w-full bg-black border-none  flex flex-col justify-center items-center">
      <CardHeader className="flex flex-col justify-center items-center">
        <Image
          src="/petclinc.webp"
          alt="petclinic"
          width={200}
          height={200}
          className="rounded-full"
        />
        <CardTitle className="text-2xl text-white">Pet clinic</CardTitle>
        <CardDescription className="text-cyan-50">
          Cuidamos lo que más aprecias
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 w-[80%]">
        <div className="grid gap-2">
          <Label className="text-cyan-50" htmlFor="email">
            Username
          </Label>
          <Input
            className="text-white"
            id="email"
            type="email"
            placeholder="example"
            required
            value={username}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="grid gap-2">
          <Label className="text-cyan-50" htmlFor="password">
            Password
          </Label>
          <Input
            className="text-white"
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <Button className="w-full" onClick={handleLogin}>Iniciar Sesion</Button>

        <Separator className="mb-6" />
        <div className="flex justify-center flex-col space-y-4">
          <Button onClick={() => signIn()}>
            <FcGoogle className="mr-2 h-4 w-4" /> Login with Email
          </Button>
        </div>
        <div className="mt-4 text-center text-sm text-cyan-50">
          Don&apos;t have an account? <SingIn />
        </div>
      </CardContent>
      <CardFooter></CardFooter>
    </Card>
  );
}
