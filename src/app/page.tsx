"use client";
import { useEspaco } from "@/context/EspacoContext";
import { ExternalLink, Link2Icon } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const { espacos } = useEspaco();

  return (
    <div className="flex flex-col items-center justify-center gap-10">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-semibold">Painel</h1>
        <p>
          Bem-vindo ao painel. Aqui você pode acessar diferentes funcionalidades
          da aplicação.
        </p>
      </div>
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {espacos.map((space) => (
            <div key={space.id} className="flex flex-col border p-4 rounded ">
             <div className="flex justify-between">
             <p className="font-bold mb-5">{space.name}</p>
              <Link href={`/area/espacos/${space.id}`}>
                <ExternalLink />
              </Link>
             </div>
              <div>
                <span>Assentos : {space.Seat.length}</span>
                <div className="flex flex-col">
                  <span className="text-emerald-500">
                    Disponíveis :{" "}
                    {space.Seat.filter((seat) => !seat.busy).length}
                  </span>
                  <span className="text-red-500">
                    Ocupados : {space.Seat.filter((seat) => seat.busy).length}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
