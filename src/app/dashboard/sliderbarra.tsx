"use client";
import React, { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { PiBuildingApartmentBold } from "react-icons/pi";
import { BiSolidBuildings } from "react-icons/bi";
import { IoIosPeople } from "react-icons/io";
import { MdEditNotifications } from "react-icons/md";
import { MdPayments } from "react-icons/md";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { BiSolidClinic } from "react-icons/bi";
import { MdOutlinePets } from "react-icons/md";







export default function SliderBarra({ children }: { children: React.ReactNode }) {
  const links = [
    {
      label: "Mis usuarios",
      href: "/dashboard",
      icon: (
        <BiSolidBuildings className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Mascotas",
      href: "/dashboard/mascotas",
      icon: (
        <MdOutlinePets className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Citas",
      href: "/dashboard/citas",
      icon: (
        <MdEditNotifications className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Facturas",
      href: "/dashboard/facturas",
      icon: (
        <MdPayments className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
  ];
  const [open, setOpen] = useState(false);
  return (
    <div
      className={cn(
        "rounded-md flex flex-col md:flex-row bg-gray-100 dark:bg-neutral-800 w-full flex-1 border border-neutral-200 dark:border-neutral-700 overflow-hidden ",
        "h-screen" // for your use case, use `h-screen` instead of `h-[60vh]`
      )}
    >
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10 border-black">
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden border-black">
            {open ? <Logo /> : <LogoIcon />}
            <div className="mt-8 flex flex-col gap-6">
              {links.map((link, idx) => (
                <SidebarLink key={idx} link={link} />
              ))}
            </div>
          </div>
        </SidebarBody>
      </Sidebar>
      {children}
    </div>
  );
}
export const Logo = () => {
  return (
    <Link
      href="#"
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
    >
      <BiSolidClinic className="text-neutral-700 dark:text-neutral-200 h-5 w-6 flex-shrink-0" />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-medium text-black dark:text-white whitespace-pre"
      >
        My Clinit
      </motion.span>
    </Link>
  );
};
export const LogoIcon = () => {
  return (
    <Link
      href="#"
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
    >
      <BiSolidClinic className="text-neutral-700 dark:text-neutral-200 h-5 w-6 flex-shrink-0" />
    </Link>
  );
};
