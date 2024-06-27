"use client";
import { destroySession } from "@/auth/cookie-auth";
import { Button } from "@/components/ui/button";
import { Profile } from "@/http/profile";
import { useQuery } from "@tanstack/react-query";
import { LoaderCircle, LogOut, Mail, User, UserRoundCog } from "lucide-react";
import { useRouter } from "next/navigation";


export default function PerfilPage() {
  const router = useRouter();

  const { data: profile, isLoading: isProfileLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: Profile,
  });
   const logout = async () => {
    destroySession();
    router.push("/auth/sign-in");
  };

  return (
    <div>
      <h1 className="text-3xl font-semibold">Perfil</h1>
      {isProfileLoading ? (
        <div className="flex justify-center items-center h-screen">
          <LoaderCircle size={24} className="animate-spin" />
        </div>
      ) : (
        <div className="flex flex-col gap-4 mt-10">
          <div className="flex gap-2 items-center justify-start">
            <User size={32} />
            <p>{profile?.name}</p>
          </div>
          <div className="flex gap-2 items-center">
            <Mail size={32} />
            <p>{profile?.email}</p>
          </div>
          <div className="flex gap-2 items-center">
            <UserRoundCog scale={34} />
            <p>{profile?.role}</p>
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
