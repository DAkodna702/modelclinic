"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "@/app/AuthContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface FacturaDTO {
  id: number;
  historiaId: number;
  nombreMascota: string;
  nombrePropietario: string;
  nombreDoctor: string;
  motivo: string;
  diagnostico: string;
  tratamiento: string;
  montoTotal: number;
  fechaCita: string;
}

export default function FacturasPage() {
  const { token: jwt } = useAuth();
  const [facturas, setFacturas] = useState<FacturaDTO[]>([]);
  const [selectedFactura, setSelectedFactura] = useState<FacturaDTO | null>(
    null
  );
  const [searchMascota, setSearchMascota] = useState<string>("");
  const [newMonto, setNewMonto] = useState<string>("");
  const [newHistoriaId, setNewHistoriaId] = useState<string>("");
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);

  const fetchAllFacturas = async () => {
    try {
      const response = await axios.get<FacturaDTO[]>(
        "http://localhost:8080/facturas/list",
        {
          headers: { Authorization: `Bearer ${jwt}` },
        }
      );
      setFacturas(response.data);
    } catch (error) {
      console.error("Error fetching facturas:", error);
    }
  };

  const handleCreateFactura = async () => {
    if (!newMonto || !newHistoriaId) {
      console.error("Missing monto or historia ID");
      return;
    }
    try {
      const facturaData = {
        historiaId: parseInt(newHistoriaId),
        montoTotal: parseFloat(newMonto),
      };
      await axios.post("http://localhost:8080/facturas/crear", facturaData, {
        headers: { Authorization: `Bearer ${jwt}` },
      });
      fetchAllFacturas();
      setOpenCreateModal(false);
    } catch (error) {
      console.error("Error creating factura:", error);
    }
  };

  const handleUpdateFactura = async () => {
    if (!selectedFactura || !newMonto) {
      console.error("Factura or newMonto not set");
      return;
    }
    try {
      await axios.put(
        `http://localhost:8080/facturas/actualizar/${selectedFactura.id}`,
        { montoTotal: parseFloat(newMonto) },
        {
          headers: { Authorization: `Bearer ${jwt}` },
        }
      );
      fetchAllFacturas();
      setOpenEditModal(false);
    } catch (error) {
      console.error("Error updating factura:", error);
    }
  };

  const handleGeneratePdfFactura = async (facturaId: number) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/facturas/pdf/${facturaId}`,
        {
          headers: { Authorization: `Bearer ${jwt}` },
          responseType: "blob",
        }
      );
      const file = new Blob([response.data], { type: "application/pdf" });
      const fileURL = URL.createObjectURL(file);
      window.open(fileURL);
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  const handleGenerateReporteGeneral = async (mascotaId: number) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/facturas/reporte/${mascotaId}`,
        {
          headers: { Authorization: `Bearer ${jwt}` },
          responseType: "blob",
        }
      );
      const file = new Blob([response.data], { type: "application/pdf" });
      const fileURL = URL.createObjectURL(file);
      window.open(fileURL);
    } catch (error) {
      console.error("Error generating report:", error);
    }
  };

  useEffect(() => {
    fetchAllFacturas();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <div className="mb-8 space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="Buscar por nombre de mascota"
            value={searchMascota}
            onChange={(e) => setSearchMascota(e.target.value)}
          />
          <Button onClick={fetchAllFacturas}>Buscar</Button>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setOpenCreateModal(true)}>
            Crear Factura
          </Button>
          <Button onClick={fetchAllFacturas}>Listar Todas las Facturas</Button>
        </div>
        <div>
          <h3 className="font-bold text-lg mb-2">
            Generar Reporte General por Mascota
          </h3>
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="ID de la Mascota"
              value={searchMascota}
              onChange={(e) => setSearchMascota(e.target.value)}
            />
            <Button
              onClick={() =>
                handleGenerateReporteGeneral(parseInt(searchMascota))
              }
            >
              Generar Reporte PDF
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {facturas.map((factura) => (
          <div key={factura.id} className="border p-4 rounded">
            <h3 className="font-bold">{factura.nombreMascota}</h3>
            <p>Propietario: {factura.nombrePropietario}</p>
            <p>Doctor: {factura.nombreDoctor}</p>
            <p>Motivo: {factura.motivo}</p>
            <p>Diagnóstico: {factura.diagnostico}</p>
            <p>Tratamiento: {factura.tratamiento}</p>
            <p>Monto: ${factura.montoTotal}</p>
            <p>Fecha de la cita: {factura.fechaCita}</p>
            <div className="flex gap-2 mt-2">
              <Button
                onClick={() => {
                  setSelectedFactura(factura);
                  setNewMonto(factura.montoTotal.toString());
                  setOpenEditModal(true);
                }}
              >
                Editar
              </Button>
              <Button onClick={() => handleGeneratePdfFactura(factura.id)}>
                Generar PDF
              </Button>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={openCreateModal} onOpenChange={setOpenCreateModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Crear Factura</DialogTitle>
          </DialogHeader>
          <Input
            type="number"
            placeholder="Historia ID"
            value={newHistoriaId}
            onChange={(e) => setNewHistoriaId(e.target.value)}
          />
          <Input
            type="number"
            placeholder="Monto Total"
            value={newMonto}
            onChange={(e) => setNewMonto(e.target.value)}
          />
          <Button onClick={handleCreateFactura} className="mt-4">
            Crear Factura
          </Button>
        </DialogContent>
      </Dialog>

      {selectedFactura && (
        <Dialog open={openEditModal} onOpenChange={setOpenEditModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Factura</DialogTitle>
            </DialogHeader>
            <Input
              type="number"
              placeholder="Monto Total"
              value={newMonto}
              onChange={(e) => setNewMonto(e.target.value)}
            />
            <Button onClick={handleUpdateFactura} className="mt-4">
              Actualizar Factura
            </Button>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
