"use client"

import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';

interface Props {
    params: { newespace: string }
}

interface ReservationPoint {
    id: string;
    x: number;
    y: number;
}

export default function NewPage({ params }: Props) {
    const [image, setImage] = useState<string | null>(null);
    const [reservationPoints, setReservationPoints] = useState<ReservationPoint[]>([]);
    const [markingActive, setMarkingActive] = useState<boolean>(false);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const imgRef = useRef<HTMLImageElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    const handleButtonClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file && file.type === 'image/png') {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result as string);
                setReservationPoints([]); // Clear previous reservation points
                setMarkingActive(false); // Reset marking status
            };
            reader.readAsDataURL(file);
        } else {
            alert("Por favor, envie um arquivo PNG.");
        }
    };

    const handleImageClick = (event: React.MouseEvent<HTMLImageElement>) => {
        if (imgRef.current && markingActive) {
            const rect = imgRef.current.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            const id = `${reservationPoints.length + 1}`; // Unique identifier for each point
            setReservationPoints((prevPoints) => [...prevPoints, { id, x, y }]);
        }
    };

    const handleRemoveImage = () => {
        setImage(null);
        setReservationPoints([]);
        setMarkingActive(false);
    };

    const handleSavePoints = () => {
        if (!imgRef.current || !canvasRef.current || !image) return;

        
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        if (context) {
            
            const img = new Image();
            img.src = image;
            img.onload = () => {
                
                canvas.width = img.width;
                canvas.height = img.height;

                
                context.drawImage(img, 0, 0);

                
                reservationPoints.forEach(point => {
                    context.beginPath();
                    context.arc(point.x, point.y, 20, 0, 2 * Math.PI);
                    context.fillStyle = 'red';
                    context.fill();
                    context.fillStyle = 'white';
                    context.font = '14px Arial';
                    context.textAlign = 'center';
                    context.textBaseline = 'middle';
                    context.fillText(point.id, point.x, point.y);
                });

                
                const newImage = canvas.toDataURL('image/png');
                setImage(newImage);

                alert("Pontos de reserva salvos com sucesso!");
            };
        }
    };

    return (
        <div style={{ textAlign: 'center', padding: '20px' }}>
            <h1>Espaço Novo: {params.newespace}</h1>
            <div style={{ margin: '20px' }}>
                <input 
                    type="file" 
                    ref={fileInputRef} 
                    accept="image/png" 
                    onChange={handleImageUpload} 
                    style={{ display: 'none' }} 
                />
                <Button 
                    onClick={handleButtonClick} 
                    variant="secondary"
                    style={{ cursor: 'pointer' }}
                >
                    Upload Imagem
                </Button>
                {image && (
                    <div style={{ marginTop: '20px' }}>
                        <Button 
                            onClick={() => setMarkingActive(true)} 
                            variant="secondary"
                            style={{ cursor: 'pointer' }}
                        >
                            Iniciar Marcações
                        </Button>
                        <Button 
                            onClick={handleRemoveImage} 
                            variant="destructive"
                            style={{ marginLeft: '10px', cursor: 'pointer' }}
                        >
                            Remover Imagem
                        </Button>
                    </div>
                )}
                {image && markingActive && (
                    <div style={{ position: 'relative', display: 'inline-block', marginTop: '20px' }}>
                        <img 
                            ref={imgRef}
                            src={image} 
                            alt="Ambiente de coworking" 
                            style={{ 
                                maxWidth: '100%', 
                                height: 'auto', 
                                cursor: 'crosshair',
                            }} 
                            onClick={handleImageClick}
                        />
                        <canvas 
                            ref={canvasRef} 
                            style={{ display: 'none' }} 
                        />
                        {reservationPoints.map((point) => (
                            <div 
                                key={point.id}
                                style={{
                                    position: 'absolute',
                                    left: `${point.x}px`,
                                    top: `${point.y}px`,
                                    width: '40px',
                                    height: '40px',
                                    backgroundColor: 'red',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    color: 'white',
                                    fontSize: '14px',
                                    fontWeight: 'bold',
                                    transform: 'translate(-50%, -50%)',
                                }}
                            >
                                {point.id}
                            </div>
                        ))}
                    </div>
                )}
                {markingActive && reservationPoints.length > 0 && (
                    <div style={{ marginTop: '20px' }}>
                        <Button variant="default" onClick={handleSavePoints}>
                            Salvar Locais de Reserva
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
