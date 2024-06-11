import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

interface EspacoCardProps {
    onCreate: (itemName: string) => void;
}

export function EspacoCard({ onCreate }: EspacoCardProps) {
    const [itemName, setItemName] = useState('');

    const handleCreate = () => {
        if (itemName.trim() !== '') {
            onCreate(itemName);
            setItemName(''); 
        }
    };

    return (
        <Card className="w-[350px]">
            <CardHeader>
                <CardTitle>Criar novo espaço</CardTitle>
            </CardHeader>
            <CardContent>
                <form>
                    <div className="grid w-full items-center gap-4">
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="name">Nome</Label>
                            <Input 
                                id="name" 
                                placeholder="Nome do espaço" 
                                value={itemName} 
                                onChange={(e) => setItemName(e.target.value)} 
                            />
                        </div>
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="espaco">Tipo de Espaço</Label>
                            <Select>
                                <SelectTrigger id="espaco">
                                    <SelectValue placeholder="Selecione" />
                                </SelectTrigger>
                                <SelectContent position="popper">
                                    <SelectItem value="coworking">Coworking</SelectItem>
                                    <SelectItem value="confroom">Sala de Conferência (indisp.)</SelectItem>
                                    <SelectItem value="estacionamento">Estacionamento (indisp.)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </form>
            </CardContent>
            <CardFooter className="flex justify-between">
                <Button onClick={handleCreate}>Criar</Button>
            </CardFooter>
        </Card>
    );
}
