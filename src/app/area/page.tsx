import React from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Areas() {
   
    const hubs = [
        { id: 'hub-investe-piaui', name: 'Hub Investe Piauí' },
        { id: 'hub-2', name: 'Hub 2' },
        { id: 'hub-3', name: 'Hub 3' },
    ];

    return (
        <div className="p-4">
            <h1 className="text-3xl font-semibold mb-4">Áreas de Coworking</h1>
            <ul className="space-y-4">
                {hubs.map((hub) => (
                    <li key={hub.id} className="p-4 border border-gray-300 rounded shadow-sm flex justify-between items-center">
                        <span>{hub.name}</span>
                        {hub.id === 'hub-investe-piaui' ? (
                            <Link href="/area/espacos">
                                <Button variant="outline">Ver Detalhes</Button>
                            </Link>
                        ) : (
                            <Button variant="outline" disabled>Ver Detalhes</Button>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}
