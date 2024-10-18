"use cliente";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { IoClose } from "react-icons/io5";

export function SingIn() {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="link" className="text-white border-none">
          Sign In
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogFooter>
          <AlertDialogCancel className="border-none">
            <IoClose />
          </AlertDialogCancel>
        </AlertDialogFooter>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-center text-2xl">
            Pet Clinic
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center text-black text-xl">
            Estas apunto de Unirte
          </AlertDialogDescription>
        </AlertDialogHeader>
        <Card className="mx-0 max-w-full border-none bg-none">
          <CardContent>
            <div className="grid gap-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="first-name">Username</Label>
                  <Input id="Username" placeholder="Example" required />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" />
              </div>
              <Button type="submit" className="w-full">
                Create an account
              </Button>
            </div>
          </CardContent>
        </Card>
      </AlertDialogContent>
    </AlertDialog>
  );
}
