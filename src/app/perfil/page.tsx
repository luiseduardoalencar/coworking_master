"use client";

import { destroySession, getAuthToken } from "@/auth/cookie-auth";
import { Button } from "@/components/ui/button";
import { api } from "@/http/api-client";
import { HTTPError } from "ky";
import { LoaderCircle, LogOut, Mail, User, UserRoundCog } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface ProfileProps {
  name: string;
  email: string;
  id: string;
  role: string;
}

export default function PerfilPage() {
  const [profile, setProfile] = useState<ProfileProps | null>(null);
  const router = useRouter();

  const getPerfil = async () => {
    const token = await getAuthToken();
    try {
      const response = await api
        .get("/api/admin/get-admin-profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .json<ProfileProps>();

      setProfile(response);
    } catch (error) {
      if (error instanceof HTTPError) {
        console.error(error.message);
      }
    }
  };

  const logout = async () => {
    destroySession();
    router.push("/auth/sign-in");
  };

  useEffect(() => {
    getPerfil();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-semibold">Perfil</h1>
      {profile === null ? (
        <div className="flex justify-center items-center h-screen">
          <LoaderCircle size={24} className="animate-spin" />
        </div>
      ) : (
        <div className="flex flex-col gap-4 mt-10">
          <div className="flex gap-2 items-center justify-start">
            <User size={32} />
            <p>{profile.name}</p>
          </div>
          <div className="flex gap-2 items-center">
            <Mail size={32} />
            <p>{profile.email}</p>
          </div>
          <div className="flex gap-2 items-center">
            <UserRoundCog scale={34} />
            <p>{profile.role}</p>
          </div>
          <div className="flex items-center">
            <LogOut />
            <Button
              className="bg-transparent hover:bg-transparent text-white"
              onClick={() => logout()}
            >
              Sair
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
