import React from "react";
import SliderBarra from "@/app/dashboard/sliderbarra";
import BarraSuperior from "@/app/dashboard/serarchandicon";
import ProtectedRoute from "../ProtecteRoute";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <SliderBarra>
        <BarraSuperior />
        {children}
      </SliderBarra>
    </ProtectedRoute>
  );
}
