import path from 'path';
import fs from 'fs';

const filePath = path.join(__dirname, '../database/orders.json');

// Utilizamos la interfaz para validar en tiempos de ejecución
export interface Order {
    id: string,
    userId: string,
    tipoImagen: 'foto_personal' | 'foto_del_artista',
    tema: string,
    artista: string,
    estado: 'en_carrito' | 'confirmado' | 'cancelado',
    fecha: string
};

export function readDataBase() : Order[] {
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data)
};

export function save(orders: Order[]) : void {
    fs.writeFileSync(filePath, JSON.stringify(orders, null, 2))
};
