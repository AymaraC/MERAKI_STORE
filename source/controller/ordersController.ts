import { readDataBase, save } from "../model/ordersModel";
import { Request, Response, NextFunction } from "express";
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';

// Por fuera de la clase hacemos la validación Zod para agregar una nueva orden
const addOrderSchema = z.object({
  tipoImagen: z.enum(["foto_personal", "foto_del_artista"], {
    message: "Debe elegir si es foto personal o foto del artista",
  }),
  
  imagenUrl: z.string().url("La URL de la imagen no es válida"),
  tema: z.string().min(1, "El tema no puede estar vacío"),
  artista: z.string().min(1, "El artista no puede estar vacío"),
  fecha: z.string().optional(),
});

export class ordersController {
    // Requiere autenticacion y requiere rol de admin
    static getOrders(req: Request, res: Response, next: NextFunction) {
        try {
            const orders = readDataBase();
            res.status(200).json({orders});

        } catch(error) {
            console.error("Error en getOrder:", error);
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
        const parsed = addOrderSchema.safeParse(req.body);

        if (!parsed.success) {
        return res.status(400).json({
            errors: parsed.error.format(),
        });
    }

    const { tipoImagen, imagenUrl, tema, artista, fecha } = parsed.data;

    const orders = readDataBase();

    const newOrder = {
      id: uuidv4(),
      userId: req.user!.id,
      tipoImagen,
      imagenUrl,
      tema,
      artista,
      estado: "en_carrito" as const,
      fecha: fecha ?? "",           // Al ser opcional la fecha, utilizamos el operador ?? por si el usuario envía null o undefined que use el string vacío
      precio: 15000,              // Definimos el precio porque es el mismo para todos los cuadros
    };

        orders.push(newOrder);
        save(orders);

        res.status(201).json({
        message: "Orden creada con éxito.",
        order: newOrder,
        });

    } catch (error) {
        console.error("Error en addOrder:", error);
        res.status(500).json({ error: 'Error al agregar la orden.' });
        } // cierra try/catch
    
    } // cierra addOrders

    static editOrder(req: Request, res: Response) {
        try {
        const orderId = req.params.id;
        const orders = readDataBase();
        const findOrder = orders.find(order => order.id === orderId); 

        if(!findOrder) return res.status(404).json({error: 
            'No se encontró un pedido con ese ID.'});

        if(findOrder.userId !== req.user!.id && req.user!.role !== "admin") return res.status(403).json({error:       // Agrego está validación para evitar que el usuario pueda editar otra orden que no sea suya salvo que sea el admin
            'No autorizado.'
        });

        if(findOrder.estado !== 'en_carrito') return res.status(403).json({error: 
            'No se puede modificar una orden ya confirmada o cancelada.'});

    /*  safeParse() devuelve un objeto con:
        success -> true/false
        data -> body validado (solo si success = true)
        error -> detalles (solo si success = false) */
        const parsedData = addOrderSchema.safeParse(req.body);          

        if (!parsedData.success) {
        return res.status(400).json({
            errors: parsedData.error.format(),
        });
    }
    
    // Actualizamos los campos
    Object.assign(findOrder, {          // El object.assign copia todas las propiedades de un objeto y las copia, si existe las sobreescribe y sino las crea. Se le pasa el objeto primero y después las propiedades a editar.
    tipoImagen: parsedData.data.tipoImagen,
    imagenUrl: parsedData.data.imagenUrl,
    tema: parsedData.data.tema,
    artista: parsedData.data.artista,
    fecha: parsedData.data.fecha ?? "",

    });

    save(orders);
    res.status(200).json({ message: "Orden actualizada", order: findOrder });

    }  catch(error) {
        console.error("Error en editOrder:", error);
        res.status(500).json({ error: "Error al actualizar la orden" });
    }
    
}       // Cierre edit order

    static deleteOrder(req: Request, res: Response, next: NextFunction) {
        try {
        const orderId = req.params.id;
        const orders = readDataBase();
        const findId = orders.find(order => order.id === orderId);
        if(!findId) return res.status(404).json({error: 
            'No se encontró ningún pedido con ese ID'});

        if(findId.userId !== req.user!.id && req.user!.role !== 'admin') {
            return res.status(403).json({error: 'No autorizado.'})
        }

        if(findId.estado !== 'en_carrito') return res.status(400).json({error: 
            'No se puede eliminar la orden ya que no se encuentra en el carrito.'
        });

        const deleted = orders.filter(order => order.id !== orderId);
        save(deleted);
        res.status(200).json({message: 'Orden eliminada con éxito.', order: findId});

    } catch(error) {
        console.error("Error en deleteOrder:", error);
        res.status(500).json({ error: "Error al eliminar la orden" });
        next(error)
        }       // Cierra try/catch

    } //Cierre deleteOrder

} // Cierra clase

