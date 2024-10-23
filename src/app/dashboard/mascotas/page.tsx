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
import { useAuth } from "@/app/AuthContext";

interface MascotDTO {
  name: string;
  years_old: number;
  race: string;
  sex: string;
  isDeleted: boolean;
  userentidadId: number;
}

interface MascotDTORseponse {
  id: number; // Agregar el id para manejar correctamente las mascotas
  name: string;
  years_old: number;
  race: string;
  sex: string;
  username: string;
  imageUrl?: string; // Campo opcional para la URL de imagen
}

export default function MascotPage() {
  const { token: jwt } = useAuth();
  const [mascots, setMascots] = useState<MascotDTORseponse[]>([]);
  const [filteredMascots, setFilteredMascots] = useState<MascotDTORseponse[]>(
    []
  );
  const [newMascot, setNewMascot] = useState<MascotDTO>({
    name: "",
    years_old: 0,
    race: "",
    sex: "",
    isDeleted: false,
    userentidadId: 0,
  });
  const [selectedMascot, setSelectedMascot] =
    useState<MascotDTORseponse | null>(null);
  const [search, setSearch] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    fetchMascots();
  }, []);

  const fetchMascots = async () => {
    try {
      const response = await axios.get<MascotDTORseponse[]>(
        "http://localhost:8080/mascot/listmascot",
        {
          headers: { Authorization: `Bearer ${jwt}` },
        }
      );
      setMascots(response.data);
      setFilteredMascots(response.data);
    } catch (error) {
      console.error("Error fetching mascots:", error);
    }
  };

  const handleCreate = async () => {
    try {
      await axios.post("http://localhost:8080/mascot/create", newMascot, {
        headers: { Authorization: `Bearer ${jwt}` },
      });
      fetchMascots();
    } catch (error) {
      console.error("Error creating mascot:", error);
    }
  };

  const handleUpdate = async () => {
    if (!selectedMascot) return;

    try {
      // Crea un objeto DTO para enviar solo los datos necesarios al servidor
      const updatedMascotData = {
        name: selectedMascot.name,
        years_old: selectedMascot.years_old,
        race: selectedMascot.race,
        sex: selectedMascot.sex,
      };

      await axios.put(
        `http://localhost:8080/mascot/update/${selectedMascot.id}`, // Envía el ID correcto
        updatedMascotData, // Envia el objeto actualizado
        { headers: { Authorization: `Bearer ${jwt}` } }
      );
      fetchMascots();
    } catch (error) {
      console.error("Error updating mascot:", error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`http://localhost:8080/mascot/delete/${id}`, {
        headers: { Authorization: `Bearer ${jwt}` },
      });
      fetchMascots();
    } catch (error) {
      console.error("Error deleting mascot:", error);
    }
  };

  const handleSearch = async () => {
    try {
      const response = await axios.get<MascotDTORseponse[]>(
        `http://localhost:8080/mascot/user/${search}`,
        {
          headers: { Authorization: `Bearer ${jwt}` },
        }
      );
      setFilteredMascots(response.data);
    } catch (error) {
      console.error("Error searching mascots:", error);
    }
  };

  const handleSelectMascot = (mascot: MascotDTORseponse) => {
    setSelectedMascot({ ...mascot });
    setImageUrl(mascot.imageUrl || "");
  };

  return (
    <div className="container mx-auto p-4 pt-16">
      {/* Buscador y botones */}
      <div className="flex justify-between mb-4">
        <div className="flex">
          <Input
            placeholder="Buscar por nombre de dueño"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Button onClick={handleSearch} className="ml-2">
            Buscar
          </Button>
        </div>
        <div className="flex">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="ml-2">Crear Mascota</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Crear nueva mascota</DialogTitle>
              </DialogHeader>
              <div>
                <Label>Nombre</Label>
                <Input
                  value={newMascot.name}
                  onChange={(e) =>
                    setNewMascot({ ...newMascot, name: e.target.value })
                  }
                />
                <Label>Años</Label>
                <Input
                  type="number"
                  value={newMascot.years_old}
                  onChange={(e) =>
                    setNewMascot({
                      ...newMascot,
                      years_old: parseInt(e.target.value),
                    })
                  }
                />
                <Label>Raza</Label>
                <Input
                  value={newMascot.race}
                  onChange={(e) =>
                    setNewMascot({ ...newMascot, race: e.target.value })
                  }
                />
                <Label>Sexo</Label>
                <Input
                  value={newMascot.sex}
                  onChange={(e) =>
                    setNewMascot({ ...newMascot, sex: e.target.value })
                  }
                />
                <Label>ID de Usuario</Label>
                <Input
                  type="number"
                  value={newMascot.userentidadId}
                  onChange={(e) =>
                    setNewMascot({
                      ...newMascot,
                      userentidadId: parseInt(e.target.value),
                    })
                  }
                />
                <Label>URL de Imagen</Label>
                <Input
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                />
                <Button onClick={handleCreate} className="mt-4">
                  Crear
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          <Button className="ml-2" onClick={fetchMascots}>
            Ver Todas
          </Button>
        </div>
      </div>

      {/* Tabla de mascotas */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Edad</TableHead>
            <TableHead>Raza</TableHead>
            <TableHead>Sexo</TableHead>
            <TableHead>Dueño</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredMascots.map((mascot) => (
            <TableRow key={mascot.id}>
              <TableCell>{mascot.name}</TableCell>
              <TableCell>{mascot.years_old}</TableCell>
              <TableCell>{mascot.race}</TableCell>
              <TableCell>{mascot.sex}</TableCell>
              <TableCell>{mascot.username}</TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        onClick={() => handleSelectMascot(mascot)}
                      >
                        Editar
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Editar Mascota</DialogTitle>
                      </DialogHeader>
                      <div>
                        <Label>Nombre</Label>
                        <Input
                          value={selectedMascot?.name || ""}
                          onChange={(e) =>
                            setSelectedMascot((prevMascot) => ({
                              ...prevMascot!,
                              name: e.target.value,
                            }))
                          }
                        />
                        <Label>Años</Label>
                        <Input
                          type="number"
                          value={selectedMascot?.years_old ?? 0}
                          onChange={(e) =>
                            setSelectedMascot((prevMascot) => ({
                              ...prevMascot!,
                              years_old: parseInt(e.target.value) || 0,
                            }))
                          }
                        />
                        <Label>Raza</Label>
                        <Input
                          value={selectedMascot?.race || ""}
                          onChange={(e) =>
                            setSelectedMascot((prevMascot) => ({
                              ...prevMascot!,
                              race: e.target.value,
                            }))
                          }
                        />
                        <Label>Sexo</Label>
                        <Input
                          value={selectedMascot?.sex || ""}
                          onChange={(e) =>
                            setSelectedMascot((prevMascot) => ({
                              ...prevMascot!,
                              sex: e.target.value,
                            }))
                          }
                        />
                        <Label>URL de Imagen</Label>
                        <Input
                          value={imageUrl}
                          onChange={(e) => setImageUrl(e.target.value)}
                        />
                        <Button onClick={handleUpdate}>Actualizar</Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                  <Button
                    variant="destructive"
                    onClick={() => handleDelete(mascot.id)}
                  >
                    Eliminar
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
