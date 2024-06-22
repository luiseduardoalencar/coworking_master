'use client'
import { api } from "@/http/api-client";
import {getCookie} from "cookies-next";
import { HTTPError } from "ky";
import { useEffect, useState } from "react";

interface ProfileProps {
    name: string;
    email: string;
    id: string;
    role: string;
}

export default function PerfilPage() {
    const [profile, setProfile] = useState<ProfileProps | undefined>(undefined);
    const getPerfil = async () => {
        try {
            const token = getCookie("token");
            const response = await api.get("/api/admin/get-admin-profile", {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            }).json<ProfileProps>() 
            
            setProfile(response)
        } catch (error) {
            if (error instanceof HTTPError) {
                console.error(error.message);
            }
        }

    }

  useEffect(() => {
    getPerfil()
  }, [])

    return (
        <div>
            <h1 className="text-3xl font-semibold">Perfil</h1>
            {profile && (
                <div>
                    <p>Nome: {profile.name}</p>
                    <p>Email: {profile.email}</p>
                    <p>ID: {profile.id}</p>
                    <p>Role: {profile.role}</p>
                </div>
            )}
        </div>
    );
}