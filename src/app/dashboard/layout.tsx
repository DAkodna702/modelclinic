import React from "react";
import SliderBarra from "@/app/dashboard/sliderbarra";
import BarraSuperior from "@/app/dashboard/serarchandicon";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SliderBarra>
      <BarraSuperior />
      {children}
    </SliderBarra>
  );
}
