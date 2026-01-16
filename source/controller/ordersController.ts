import { readDataBase, save } from "../model/ordersModel";
import { Request, Response, NextFunction } from "express";
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';

export class ordersController {
    // Requiere autenticacion y requiere rol de admin
    static getOrders(req: Request, res: Response, next: NextFunction) {
        try {
            const orders = readDataBase();
            res.status(200).json({orders})

        } catch(error) {
            next(error)
        }
    } 

    // Función para que el usuario logueado pueda ver su orden
    static getOrderUser(req: Request, res: Response) {
        const id = req.user!.id;            // Utilizamos el ! para que TS confíe que el usuario ya existe el usuario
        const orders = readDataBase();
        const findOrders = orders.find(order => order.userId === id);
        if(!findOrders) return res.status(400).json({message: 'El usuario no tiene carrito'});

        if(findOrders.estado !== 'en_carrito') return res.status(403).json({error: 'No se pueden mostrar ordenes que no estén en el carrito.'})
        
        res.json({findOrders});             // Devolvemos las ordenes
    }

    static addOrders(req: Request, res:Response) {          // No agrego autenticación de usuario porque de eso se encarga el middleware, si llega hasta el controller esta autenticado
        try {
           const { tipoImagen, imagenUrl, tema, artista, fecha } = req.body;
           if(!tipoImagen) {
            return res.status(400).json({message: 'Falta agregar que tipo de imagen requiere.'});

           } else if(tipoImagen !== 'foto_personal' && tipoImagen !== 'foto_del_artista') {
            return res.status(400).json({message: 'Debe elegir si es foto personal o foto del artista'})
           }

           if(!imagenUrl || !tema || !artista) return res.status(400).json({message: 'Faltan completar datos obligatorios.'})

            const orders = readDataBase()
            const newOrder = {
                id: uuidv4(),
                userId : req.user!.id,
                tipoImagen,
                imagenUrl,
                tema,
                artista,
                estado: 'en_carrito' as const,
                fecha: fecha ?? "" ,     // Con ?? le decimos que si un valor no existe que devuelva el otro
                precio: '15000'
            }
            orders.push(newOrder);
            save(orders);
            res.status(201).json({message: 'Orden creada con éxito.', order: newOrder})

        } catch(error) {
            res.status(500).json({error})
        }
    }





}



export const addOrderSchema = z.object({
    tipoImagen: z.enum(['foto_personal', 'foto_del_artista'], 'Debe elergir si es foto personal o foto del artista.'),
    imagenUrl: z.string({error: 'Falta ingresar URL de la imagen'}).url('La URL de la imagen no es válida'),
    tema: z.string({error: 'Falta ingresar el tema'}).min(1, 'El tema no puede estar vacío').max(20),
    artista: z.string({error: 'Falta ingresar el artista'}).min(1, 'El artista no puede estar vacío'),
    fecha: z.string().optional()
})








