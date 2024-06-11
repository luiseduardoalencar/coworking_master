'use-client'

import {SidebarItems} from '@/types'

import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTrigger } from '../ui/sheet';
import { Button } from '../ui/button';
import { Menu, X } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { SidebarButton } from './sidebar-button';
import Link from 'next/link';


interface SidebarDesktopProps{

    sidebarItems: SidebarItems;
}

export function SidebarMobile(props: SidebarDesktopProps){
    const pathname = usePathname()
return (
    <Sheet>
        <SheetTrigger asChild>
            <Button size='icon' variant='ghost' className='fixed top-3 left-3'>
                <Menu size={20} />
            </Button>
        </SheetTrigger>
        <SheetContent side='left'className='px-3 py-4' hideClose>
            <SheetHeader className='flex flex-row justify-between items-center space-y-0'>
                <span className='text-lg font-semibold text-foregorund mx-3'>
                    Coworking 
                </span>

                <SheetClose asChild>
                    <Button className='h-7 w-7 p-0' variant = 'ghost'>
                        <X size={15}/>
                    </Button>
                </SheetClose>
                
            </SheetHeader>
            <div className='h-full'>
                <div className='mt-5 flex flex-col w-full gap-1'>
                    {props.sidebarItems.links.map((link, idx) => (
                    <Link key={idx} href={link.href}>
                        <SidebarButton
                            variant={pathname === link.href ? 'secondary' : 'ghost'}
                            icon={link.icon}
                            className='w-full'
                            >
                            {link.label}
                        </SidebarButton>
                    </Link>
            ))}
                </div>
            </div>

        </SheetContent>
    </Sheet>
)
};