"use client";

import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "@/app/AuthContext";

interface User {
  id: number;
  username: string;
  email: string;
  phone: number;
  role: string;
  password?: string;
}

interface Worker extends User {
  role: string;
}

interface AuthResponse {
  status: boolean;
  message: string;
}

interface authcreateuser {
  username: string;
  password: string;
  role: string;
  email: string;
  phone: number;
}

const workerRoles = ["Doctor", "Enfermera", "Estilista", "Recepcionista"];

export default function UserWorkerManagement() {
  const { token: jwt } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [newUser, setNewUser] = useState<Partial<User>>({ role: "Customer" });
  const [newWorker, setNewWorker] = useState<Partial<Worker>>({});
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editingWorker, setEditingWorker] = useState<Worker | null>(null);

  const fetchUsers = useCallback(async () => {
    try {
      const response = await axios.get<User[]>(
        "http://localhost:8080/auth/user/all",
        {
          headers: { Authorization: ` Bearer ${jwt}` },
        }
      );
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Error al cargar usuarios");
      console.log(jwt);
    }
  }, [jwt]);

  const fetchWorkers = useCallback(async () => {
    try {
      const response = await axios.get<Worker[]>(
        "http://localhost:8080/auth2/worker/all",
        {
          headers: { Authorization: ` Bearer ${jwt}` },
        }
      );
      setWorkers(response.data);
    } catch (error) {
      console.error("Error fetching workers:", error);
      toast.error("Error al cargar trabajadores");
    }
  }, [jwt]);

  useEffect(() => {
    fetchUsers();
    fetchWorkers();
  }, [fetchUsers, fetchWorkers]);
  /*  ------------------------------------------------------------------------ */
  const handleCreate = async (type: "user" | "worker") => {
    // Verifica que los datos estén completos antes de hacer la solicitud
    const data =
      type === "user"
        ? {
            username: newUser.username,
            password: newUser.password,
            role:"Custumer",// "Customer" por defecto
            email: newUser.email,
            phone: newUser.phone,
          }
        : {
            username: newWorker.username,
            password: newWorker.password,
            role: newWorker.role, // Según lo que se haya seleccionado
            email: newWorker.email,
            phone: newWorker.phone,
          };

    // Validar si los campos están presentes y no son nullos
    if (
      !data.username ||
      !data.password ||
      !data.role ||
      !data.email ||
      !data.phone
    ) {
      toast.error("Todos los campos son obligatorios.");
      return;
    }

    try {
      const response = await axios.post<AuthResponse>(
        `http://localhost:8080/${
          type === "user" ? "auth/user" : "auth2/worker"
        }/sign-up`,
        data, // Pasar el objeto con todos los campos completos
        { headers: { Authorization: `Bearer ${jwt}` } }
      );

      if (response.data.status) {
        toast.success(
          `${type === "user" ? "Usuario" : "Trabajador"} agregado con éxito`
        );
        if (type === "user") {
          setUsers((prevUsers) => [
            ...prevUsers,
            { ...data, id: Date.now() } as User,
          ]);
          setNewUser({ role: "Custumer" }); // Restablecer el formulario de usuario
        } else {
          setWorkers((prevWorkers) => [
            ...prevWorkers,
            { ...data, id: Date.now() } as Worker,
          ]);
          setNewWorker({}); // Restablecer el formulario de trabajador
        }
        type === "user" ? fetchUsers() : fetchWorkers();
      } else {
        toast.error(
          `No se pudo crear el ${type === "user" ? "usuario" : "trabajador"}`
        );
      }
    } catch (error) {
      console.error(`Error creating ${type}:`, error);
      toast.error(
        `Error al crear ${type === "user" ? "usuario" : "trabajador"}`
      );
    }
  };
  /* ---------------------------------------------------------------------- */
  const handleUpdate = async (type: "user" | "worker") => {
    const itemToUpdate = type === "user" ? editingUser : editingWorker;
    if (!itemToUpdate) return;

    try {
      const response = await axios.put<AuthResponse>(
        `http://localhost:8080/${
          type === "user" ? "auth/user" : "auth2/worker"
        }/updateuser`,
        itemToUpdate,
        { headers: { Authorization: ` Bearer ${jwt}` } }
      );
      if (response.data.status) {
        toast.success(
          `${type === "user" ? "Usuario" : "Trabajador"} actualizado con éxito`
        );
        if (type === "user") {
          setUsers((prevUsers) =>
            prevUsers.map((user) =>
              user.id === itemToUpdate.id ? (itemToUpdate as User) : user
            )
          );
          setEditingUser(null);
        } else {
          setWorkers((prevWorkers) =>
            prevWorkers.map((worker) =>
              worker.id === itemToUpdate.id ? (itemToUpdate as Worker) : worker
            )
          );
          setEditingWorker(null);
        }
        type === "user" ? fetchUsers() : fetchWorkers();
      } else {
        toast.error(
          `No se pudo actualizar el ${
            type === "user" ? "usuario" : "trabajador"
          }`
        );
      }
    } catch (error) {
      console.error(`Error updating ${type}:`, error);
      toast.error(
        `Error al actualizar ${type === "user" ? "usuario" : "trabajador"}`
      );
    }
  };
/*------------------------------------------------------------------------------------------------------------------ */
 const handleDelete = async (type: "user" | "worker", username: string) => {
   try {
     const response = await axios.delete<AuthResponse>(
       `http://localhost:8080/${
         type === "user" ? "auth/user" : "auth2/worker"
       }/deleteuser/${username}`,
       { headers: { Authorization: `Bearer ${jwt}` } } // Corrige el espacio antes de Bearer
     );

     if (response.data.status) {
       toast.success(
         `${type === "user" ? "Usuario" : "Trabajador"} eliminado con éxito`
       );
       if (type === "user") {
         setUsers((prevUsers) =>
           prevUsers.filter((user) => user.username !== username)
         );
       } else {
         setWorkers((prevWorkers) =>
           prevWorkers.filter((worker) => worker.username !== username)
         );
       }
       type === "user" ? fetchUsers() : fetchWorkers();
     } else {
       toast.error(
         `No se pudo eliminar el ${type === "user" ? "usuario" : "trabajador"}`
       );
     }
   } catch (error) {
     console.error(`Error deleting ${type}:`, error);
     toast.error(
       `Error al eliminar ${type === "user" ? "usuario" : "trabajador"}`
     );
   }
 };
  /*---------------------------------------------------------------------------------------------------------- */
  const renderTable = (type: "user" | "worker", data: User[] | Worker[]) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Username</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Phone</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((item) => (
          <TableRow key={item.id}>
            <TableCell>{item.id}</TableCell>
            <TableCell>{item.username}</TableCell>
            <TableCell>{item.email}</TableCell>
            <TableCell>{item.phone}</TableCell>
            <TableCell>{item.role}</TableCell>
            <TableCell>
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mr-2"
                    onClick={() =>
                      type === "user"
                        ? setEditingUser(item as User)
                        : setEditingWorker(item as Worker)
                    }
                  >
                    Edit
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      Edit {type === "user" ? "User" : "Worker"}
                    </DialogTitle>
                  </DialogHeader>
                  {renderForm(type, true)}
                </DialogContent>
              </Dialog>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDelete(type, item.username)}
              >
                Delete
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  const renderForm = (type: "user" | "worker", isEditing: boolean = false) => {
    const data = isEditing
      ? type === "user"
        ? editingUser
        : editingWorker
      : type === "user"
      ? newUser
      : newWorker;
    const setData = isEditing
      ? type === "user"
        ? setEditingUser
        : setEditingWorker
      : type === "user"
      ? setNewUser
      : setNewWorker;

    if (!data) return null;
    /**---------------------------------------------------------------------------------------------------------------------------------------- */
    return (
      <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
        <div className="grid gap-4">
          <div className="space-y-2">
            <Label htmlFor={`${type}-username`}>Username</Label>
            <Input
              id={`${type}-username`}
              value={data.username || ""}
              onChange={(e) =>
                setData((prev: any) => ({ ...prev, username: e.target.value }))
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`${type}-email`}>Email</Label>
            <Input
              id={`${type}-email`}
              type="email"
              value={data.email || ""}
              onChange={(e) =>
                setData((prev: any) => ({ ...prev, email: e.target.value }))
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`${type}-phone`}>Phone</Label>
            <Input
              id={`${type}-phone`}
              type="tel"
              value={data.phone || ""}
              onChange={(e) =>
                setData((prev: any) => ({
                  ...prev,
                  phone: parseInt(e.target.value) || 0,
                }))
              }
            />
          </div>
          {!isEditing && (
            <div className="space-y-2">
              <Label htmlFor={`${type}-password`}>Password</Label>
              <Input
                id={`${type}-password`}
                type="password"
                value={data.password || ""}
                onChange={(e) =>
                  setData((prev: any) => ({
                    ...prev,
                    password: e.target.value,
                  }))
                }
              />
            </div>
          )}
          {type === "worker" && (
            <div className="space-y-2">
              <Label htmlFor={`${type}-role`}>Role</Label>
              <Select
                onValueChange={(value: string) =>
                  setData((prev: any) => ({ ...prev, role: value }))
                }
                defaultValue={data.role}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  {workerRoles.map((role) => (
                    <SelectItem key={role} value={role}>
                      {role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
        <Button
          onClick={() => (isEditing ? handleUpdate(type) : handleCreate(type))}
        >
          {isEditing ? "Update" : "Create"}
        </Button>
      </form>
    );
  };
  /*----------------------------------------------------------------------- */
  return (
    <div className="pt-16 w-full container mx-auto p-4 space-y-8">
      <h1 className="text-3xl font-bold text-center mb-8">
        Usuarios y Trbajadores
      </h1>

      <Tabs defaultValue="users">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="workers">Workers</TabsTrigger>
        </TabsList>
        <TabsContent value="users" className="space-y-4">
          <div className="lg:grid lg:grid-cols-3 lg:gap-4">
            <div className="lg:col-span-2">{renderTable("user", users)}</div>
            <div className="mt-4 lg:mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>Create New User</CardTitle>
                </CardHeader>
                <CardContent>{renderForm("user")}</CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="workers" className="space-y-4">
          <div className="lg:grid lg:grid-cols-3 lg:gap-4">
            <div className="lg:col-span-2">
              {renderTable("worker", workers)}
            </div>
            <div className="mt-4 lg:mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>Create New Worker</CardTitle>
                </CardHeader>
                <CardContent>{renderForm("worker")}</CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
      <ToastContainer />
    </div>
  );
}
