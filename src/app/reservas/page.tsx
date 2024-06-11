"use client";

import { Button } from '@/components/ui/button';
import { useEspaco } from '@/context/EspacoContext';

export default function ReservasDisponiveis() {
    const { espacos } = useEspaco();

    return (
        <div style={{ textAlign: 'center', padding: '20px' }}>
            <h1>Espaços disponíveis</h1>
            <div style={{ marginTop: '20px' }}>
                {espacos.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                        {espacos.map((espaco, index) => (
                            <div 
                                key={index} 
                                style={{ 
                                    border: '1px solid #ccc', 
                                    borderRadius: '8px', 
                                    padding: '20px', 
                                    margin: '10px', 
                                    width: '300px', 
                                    textAlign: 'left',
                                    boxShadow: '0 0 10px rgba(0,0,0,0.1)'
                                }}
                            >
                                <h2 style={{ margin: '10px 0' }}>{espaco}</h2>
                                <Button variant="default" onClick={() => alert(`Reservar ${espaco}`)}>
                                    Reservar
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
