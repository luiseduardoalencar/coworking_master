'use client'

import { Book, BriefcaseBusiness, Contact, LayoutDashboard, User } from "lucide-react"
import { SidebarDesktop } from "./sidebar-desktop"
import { SidebarItems } from "@/types"
import {useMediaQuery} from 'usehooks-ts'
import { SidebarMobile } from "./sidebar-mobile"

const sidebarItems: SidebarItems ={
    links:[
        {
          label: "Painel",
          href: "/",
          icon: LayoutDashboard,
        },
        {
          label: "Áreas",
          href: "/area",
          icon: BriefcaseBusiness,
        },
        {
          label: "Reservas",
          href: "/reservas",
          icon:  Book
        }, 
        {
          label: "Usuários",
          href: "/usuarios",
          icon: Contact
        },
        {
            label: "Perfil",
            href: "/perfil",
            icon:  User
        },
      
      ]
}


export function Sidebar() {
    const isDesktop = useMediaQuery('(min-width: 640px)', {
      initializeWithValue: false,
    });
  
    if (isDesktop) {
      return <SidebarDesktop sidebarItems={sidebarItems} />;
    }
  
    return <SidebarMobile sidebarItems={sidebarItems} />;
  }