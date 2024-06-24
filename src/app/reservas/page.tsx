"use client";

import { Button } from '@/components/ui/button';
import { useEspaco } from '@/context/EspacoContext';
import Link from 'next/link';

export default function ReservasDisponiveis() {
    const { espacos } = useEspaco();

    return (
        <div style={{ textAlign: 'center', padding: '20px' }}>
            <h1  className='text-3xl font-bold'>Espaços disponíveis</h1>
            <div style={{ marginTop: '20px' }} >
                {espacos.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {espacos.map((espaco, index) => (
                            <div 
                                key={index} 
                                className="flex flex-col border p-4 rounded "
                            >
                                <h2 style={{ margin: '10px 0' }}>{espaco.name}</h2>
                                <Button variant="default" >
                                    <Link className='bg-transparent' href={`/reservas/${espaco.id}`}>Ver Reservas</Link>
                                </Button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>Não há espaços disponíveis no momento.</p>
                )}
            </div>
        </div>
    );
}
