"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/app/AuthContext";

interface HistoriDTO {
  id: number;
  fecha: string;
  motivo: string;
  prioridad: string;
  diagnostico: string;
  tratamiento: string;
  historistate: string;
  mascotaNombre: string;
  trabajadorNombre: string;
  trabajadorRol: string;
  mascotId: number;
  workerId: number;
}

interface HistoriDTORequest {
  fecha: string;
  motivo: string;
  prioridad: string;
  diagnostico: string;
  tratamiento: string;
  historistate: string;
  mascotId: number;
  workerId: number;
}

const historiStates = ["PENDIENTE", "CANCELADO", "POSPUESTO", "COMPLETADO"];

export default function AppointmentsPage() {
  const { token: jwt } = useAuth();
  const [allAppointments, setAllAppointments] = useState<HistoriDTO[]>([]);
  const [pendingAppointments, setPendingAppointments] = useState<HistoriDTO[]>(
    []
  );
  const [otherAppointments, setOtherAppointments] = useState<HistoriDTO[]>([]);
  const [selectedAppointment, setSelectedAppointment] =
    useState<HistoriDTO | null>(null);
  const [newAppointment, setNewAppointment] = useState<HistoriDTORequest>({
    fecha: "",
    motivo: "",
    prioridad: "",
    diagnostico: "",
    tratamiento: "",
    historistate: "PENDIENTE",
    mascotId: 0,
    workerId: 0,
  });
  const [searchId, setSearchId] = useState("");
  const [searchType, setSearchType] = useState<"mascot" | "worker">("mascot");
  const [currentView, setCurrentView] = useState<"all" | "filtered">("all");

  useEffect(() => {
    fetchAllAppointments();
  }, []);

  const fetchAllAppointments = async () => {
    try {
      const response = await axios.get<HistoriDTO[]>(
        "http://localhost:8080/hist/all",
        {
          headers: { Authorization: `Bearer ${jwt}` },
        }
      );
      setAllAppointments(response.data);
      setPendingAppointments(
        response.data.filter((app) => app.historistate === "PENDIENTE")
      );
      setOtherAppointments(
        response.data.filter((app) => app.historistate !== "PENDIENTE")
      );
    } catch (error) {
      console.error("Error fetching all appointments:", error);
    }
  };

  const fetchFilteredAppointments = async () => {
    try {
      const pendingEndpoint =
        searchType === "mascot"
          ? `/hist/mascotP/${searchId}`
          : `/hist/workerP/${searchId}`;
      const otherEndpoint =
        searchType === "mascot"
          ? `/hist/mascotT/${searchId}`
          : `/hist/workerT/${searchId}`;

      const [pendingResponse, otherResponse] = await Promise.all([
        axios.get<HistoriDTO[]>(`http://localhost:8080${pendingEndpoint}`, {
          headers: { Authorization: `Bearer ${jwt}` },
        }),
        axios.get<HistoriDTO[]>(`http://localhost:8080${otherEndpoint}`, {
          headers: { Authorization: `Bearer ${jwt}` },
        }),
      ]);

      setPendingAppointments(pendingResponse.data);
      setOtherAppointments(
        otherResponse.data.filter((app) => app.historistate !== "PENDIENTE")
      );
      setCurrentView("filtered");
    } catch (error) {
      console.error("Error fetching filtered appointments:", error);
    }
  };

  const handleSearch = () => {
    if (searchId) {
      fetchFilteredAppointments();
    }
  };
/*------------------------------------------------------------------------------ */
  const handleUpdateAppointment = async (updatedAppointment: HistoriDTO) => {
    try {
      const requestBody: HistoriDTORequest = {
        fecha: updatedAppointment.fecha,
        motivo: updatedAppointment.motivo,
        prioridad: updatedAppointment.prioridad,
        diagnostico: updatedAppointment.diagnostico,
        tratamiento: updatedAppointment.tratamiento,
        historistate: updatedAppointment.historistate,
        mascotId: updatedAppointment.mascotId,
        workerId: updatedAppointment.workerId,
      };
      console.log("Request Body:", requestBody);
      await axios.put(
        `http://localhost:8080/hist/updateC/${updatedAppointment.id}`,
        requestBody,
        {
          headers: { Authorization: `Bearer ${jwt}` },
        }
      );
      if (currentView === "all") {
        fetchAllAppointments();
      } else {
        fetchFilteredAppointments();
      }
    } catch (error) {
      console.error("Error updating appointment:", error);
    }
  };

  const handleCreateAppointment = async () => {
    try {
      await axios.post("http://localhost:8080/hist/save", newAppointment, {
        headers: { Authorization: `Bearer ${jwt}` },
      });
      fetchAllAppointments();
      setNewAppointment({
        fecha: "",
        motivo: "",
        prioridad: "",
        diagnostico: "",
        tratamiento: "",
        historistate: "PENDIENTE",
        mascotId: 0,
        workerId: 0,
      });
    } catch (error) {
      console.error("Error creating new appointment:", error);
    }
  };

  const renderAppointmentTable = (
    appointments: HistoriDTO[],
    title: string
  ) => (
    <>
      <h2 className="text-xl font-bold mt-8 mb-2">{title}</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Reason</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>State</TableHead>
            <TableHead>Pet Name</TableHead>
            <TableHead>Worker Name</TableHead>
            <TableHead>Worker Role</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {appointments.map((appointment) => (
            <TableRow key={appointment.id}>
              <TableCell>{appointment.fecha}</TableCell>
              <TableCell>{appointment.motivo}</TableCell>
              <TableCell>{appointment.prioridad}</TableCell>
              <TableCell>{appointment.historistate}</TableCell>
              <TableCell>{appointment.mascotaNombre}</TableCell>
              <TableCell>{appointment.trabajadorNombre}</TableCell>
              <TableCell>{appointment.trabajadorRol}</TableCell>
              <TableCell>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button onClick={() => setSelectedAppointment(appointment)}>
                      Edit
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Edit Appointment</DialogTitle>
                    </DialogHeader>
                    {selectedAppointment && (
                      <div className="space-y-4">
                        <div>
                          <Label>Fecha</Label>
                          <Input
                            type="date"
                            value={selectedAppointment.fecha}
                            onChange={(e) =>
                              setSelectedAppointment({
                                ...selectedAppointment,
                                fecha: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div>
                          <Label>Motivo</Label>
                          <Input
                            value={selectedAppointment.motivo}
                            onChange={(e) =>
                              setSelectedAppointment({
                                ...selectedAppointment,
                                motivo: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div>
                          <Label>Prioridad</Label>
                          <Input
                            value={selectedAppointment.prioridad}
                            onChange={(e) =>
                              setSelectedAppointment({
                                ...selectedAppointment,
                                prioridad: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div>
                          <Label>Diagnostico</Label>
                          <Input
                            value={selectedAppointment.diagnostico}
                            onChange={(e) =>
                              setSelectedAppointment({
                                ...selectedAppointment,
                                diagnostico: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div>
                          <Label>tratamiento</Label>
                          <Input
                            value={selectedAppointment.tratamiento}
                            onChange={(e) =>
                              setSelectedAppointment({
                                ...selectedAppointment,
                                tratamiento: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div>
                          <Label>State</Label>
                          <Select
                            value={selectedAppointment.historistate}
                            onValueChange={(value) =>
                              setSelectedAppointment({
                                ...selectedAppointment,
                                historistate: value,
                              })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select a state" />
                            </SelectTrigger>
                            <SelectContent>
                              {historiStates.map((state) => (
                                <SelectItem key={state} value={state}>
                                  {state}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Mascota ID</Label>
                          <Input
                            value={selectedAppointment.mascotId}
                            onChange={(e) =>
                              setSelectedAppointment({
                                ...selectedAppointment,
                                mascotId: parseInt(e.target.value),
                              })
                            }
                          />
                        </div>
                        <div>
                          <Label>Empleado</Label>
                          <Input
                            value={selectedAppointment.workerId}
                            onChange={(e) =>
                              setSelectedAppointment({
                                ...selectedAppointment,
                                workerId: parseInt(e.target.value),
                              })
                            }
                          />
                        </div>
                        <Button
                          onClick={() =>
                            handleUpdateAppointment(selectedAppointment)
                          }
                          className="w-full"
                        >
                          Update Appointment
                        </Button>
                      </div>
                    )}
                  </DialogContent>
                </Dialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );

  return (
    <div className="container mx-auto p-4 pt-24">
      {" "}
      {/* Added pt-24 for top padding */}
      <div className="flex justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Input
            placeholder={`Search by ${searchType} ID`}
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
          />
          <Select
            value={searchType}
            onValueChange={(value: "mascot" | "worker") => setSearchType(value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Search type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="mascot">Mascot</SelectItem>
              <SelectItem value="worker">Worker</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleSearch}>Search</Button>
        </div>
        <div className="flex space-x-2">
          <Button
            onClick={() => {
              setCurrentView("all");
              fetchAllAppointments();
            }}
          >
            Show All Appointments
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button>Create New Appointment</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Appointment</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Date</Label>
                  <Input
                    type="date"
                    value={newAppointment.fecha}
                    onChange={(e) =>
                      setNewAppointment({
                        ...newAppointment,
                        fecha: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <Label>Reason</Label>
                  <Input
                    value={newAppointment.motivo}
                    onChange={(e) =>
                      setNewAppointment({
                        ...newAppointment,
                        motivo: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <Label>Priority</Label>
                  <Input
                    value={newAppointment.prioridad}
                    onChange={(e) =>
                      setNewAppointment({
                        ...newAppointment,
                        prioridad: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <Label>Diagnosis</Label>
                  <Input
                    value={newAppointment.diagnostico}
                    onChange={(e) =>
                      setNewAppointment({
                        ...newAppointment,
                        diagnostico: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <Label>Treatment</Label>
                  <Input
                    value={newAppointment.tratamiento}
                    onChange={(e) =>
                      setNewAppointment({
                        ...newAppointment,
                        tratamiento: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <Label>State</Label>
                  <Select
                    value={newAppointment.historistate}
                    onValueChange={(value) =>
                      setNewAppointment({
                        ...newAppointment,
                        historistate: value,
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a state" />
                    </SelectTrigger>
                    <SelectContent>
                      {historiStates.map((state) => (
                        <SelectItem key={state} value={state}>
                          {state}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Pet ID</Label>
                  <Input
                    type="number"
                    value={newAppointment.mascotId.toString()}
                    onChange={(e) =>
                      setNewAppointment({
                        ...newAppointment,
                        mascotId: parseInt(e.target.value),
                      })
                    }
                  />
                </div>
                <div>
                  <Label>Worker ID</Label>
                  <Input
                    type="number"
                    value={newAppointment.workerId.toString()}
                    onChange={(e) =>
                      setNewAppointment({
                        ...newAppointment,
                        workerId: parseInt(e.target.value),
                      })
                    }
                  />
                </div>
                <Button onClick={handleCreateAppointment} className="w-full">
                  Create Appointment
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      {currentView === "all" ? (
        renderAppointmentTable(allAppointments, "All Appointments")
      ) : (
        <>
          {renderAppointmentTable(pendingAppointments, "Pending Appointments")}
          {renderAppointmentTable(otherAppointments, "Other Appointments")}
        </>
      )}
    </div>
  );
}
