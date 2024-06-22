'use client';

import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/sidebar/sidebar";
import { EspacoProvider } from "@/context/EspacoContext";
import { UserProvider } from "@/context/UserContext";
import {  usePathname } from "next/navigation";


const inter = Inter({ subsets: ["latin"] });


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isSingInPage = pathname === "/auth/sign-in" || pathname === "/auth/sign-up";
 
  return (

    <html lang="pt" className="dark">

      <body className={inter.className}>
        <UserProvider>
        <EspacoProvider>
        {isSingInPage ? null : <Sidebar />}
        <main className="mx-5 mt-16 sm:ml-[300px] sm:mt-3">{children}</main>
        </EspacoProvider>
        </UserProvider>
        </body>

    </html>
  );
}
