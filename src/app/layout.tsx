

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/sidebar/sidebar";
import { EspacoProvider } from "@/context/EspacoContext";



const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Coworking Investe Pi",
  description: "Gerenciador de espaços de coworking",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (

    <html lang="pt" className="dark">

      <body className={inter.className}>
        <EspacoProvider>
        <Sidebar/>
        <main className="mx-5 mt-16 sm:ml-[300px] sm:mt-3">{children}</main>
        </EspacoProvider>
        </body>

    </html>
  );
}
