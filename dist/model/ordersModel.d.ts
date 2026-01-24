export interface Order {
    id: string;
    userId: string;
    tipoImagen: 'foto_personal' | 'foto_del_artista';
    imagenUrl: string;
    tema: string;
    artista: string;
    estado: 'en_carrito' | 'confirmado' | 'cancelado';
    fecha?: string;
    precio: number;
}
export declare function readDataBase(): Order[];
export declare function save(orders: Order[]): void;
//# sourceMappingURL=ordersModel.d.ts.map