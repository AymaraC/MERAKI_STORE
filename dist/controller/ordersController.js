"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ordersController = void 0;
const ordersModel_1 = require("../model/ordersModel");
const uuid_1 = require("uuid");
const zod_1 = require("zod");
// Por fuera de la clase hacemos la validación Zod para agregar una nueva orden
const addOrderSchema = zod_1.z.object({
    tipoImagen: zod_1.z.enum(["foto_personal", "foto_del_artista"], {
        message: "Debe elegir si es foto personal o foto del artista",
    }),
    imagenUrl: zod_1.z.string().url("La URL de la imagen no es válida"),
    tema: zod_1.z.string().min(1, "El tema no puede estar vacío"),
    artista: zod_1.z.string().min(1, "El artista no puede estar vacío"),
    fecha: zod_1.z.string().optional(),
});
// Validación zod para que el admin pueda cambiar el estado de la orden
const updateOrderStatusSchema = zod_1.z.object({
    estado: zod_1.z.enum(["confirmado", "cancelado"], {
        message: "El estado debe ser 'confirmado' o 'cancelado'",
    }),
});
class ordersController {
    // Requiere autenticacion y requiere rol de admin
    static getOrders(req, res, next) {
        try {
            const orders = (0, ordersModel_1.readDataBase)();
            res.status(200).json({ orders });
        }
        catch (error) {
            console.error("Error en getOrder:", error);
            next(error);
        }
    }
    // Función para que el usuario logueado pueda ver su orden
    static getOrderUser(req, res, next) {
        try {
            const id = req.user.id; // Utilizamos el ! para que TS confíe que el usuario ya existe el usuario
            const orders = (0, ordersModel_1.readDataBase)();
            const userOrders = orders.filter(order => order.userId === id && order.estado === "en_carrito");
            if (userOrders.length === 0) {
                return res.status(400).json({ message: "El usuario no tiene órdenes en carrito" });
            }
            res.json({ orders: userOrders }); // devolvemos las correspondientes al usuario
        }
        catch (error) {
            console.error("Error en getOrderUser:", error);
            next(error);
        } // cierro try/catch
    } // Cierro getOrderUser
    static addOrders(req, res) {
        try {
            const parsed = addOrderSchema.safeParse(req.body);
            if (!parsed.success) {
                return res.status(400).json({
                    errors: parsed.error.format(),
                });
            }
            const { tipoImagen, imagenUrl, tema, artista, fecha } = parsed.data;
            const orders = (0, ordersModel_1.readDataBase)();
            const newOrder = {
                id: (0, uuid_1.v4)(),
                userId: req.user.id,
                tipoImagen,
                imagenUrl,
                tema,
                artista,
                estado: "en_carrito",
                fecha: fecha !== null && fecha !== void 0 ? fecha : "", // Al ser opcional la fecha, utilizamos el operador ?? por si el usuario envía null o undefined que use el string vacío
                precio: 15000 // Definimos el precio porque es el mismo para todos los cuadros
            };
            orders.push(newOrder);
            (0, ordersModel_1.save)(orders);
            res.status(201).json({
                message: "Orden creada con éxito.",
                order: newOrder,
            });
        }
        catch (error) {
            console.error("Error en addOrder:", error);
            res.status(500).json({ error: 'Error al agregar la orden.' });
        } // cierra try/catch
    } // cierra addOrders
    static editOrder(req, res, next) {
        var _a;
        try {
            const orderId = req.params.id;
            const orders = (0, ordersModel_1.readDataBase)();
            const findOrder = orders.find(order => order.id === orderId);
            if (!findOrder)
                return res.status(404).json({ error: 'No se encontró un pedido con ese ID.' });
            if (findOrder.userId !== req.user.id && req.user.role !== "admin")
                return res.status(403).json({ error: // Agrego está validación para evitar que el usuario pueda editar otra orden que no sea suya salvo que sea el admin
                    'No autorizado.'
                });
            if (findOrder.estado !== 'en_carrito')
                return res.status(403).json({ error: 'No se puede modificar una orden ya confirmada o cancelada.' });
            /*safeParse() devuelve un objeto con:
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
            Object.assign(findOrder, {
                tipoImagen: parsedData.data.tipoImagen,
                imagenUrl: parsedData.data.imagenUrl,
                tema: parsedData.data.tema,
                artista: parsedData.data.artista,
                fecha: (_a = parsedData.data.fecha) !== null && _a !== void 0 ? _a : "",
            });
            (0, ordersModel_1.save)(orders);
            res.status(200).json({ message: "Orden actualizada", order: findOrder });
        }
        catch (error) {
            console.error("Error en editOrder:", error);
            next(error);
        }
    } // Cierre edit order
    static deleteOrder(req, res, next) {
        try {
            const orderId = req.params.id;
            const orders = (0, ordersModel_1.readDataBase)();
            const findId = orders.find(order => order.id === orderId);
            if (!findId)
                return res.status(404).json({ error: 'No se encontró ningún pedido con ese ID' });
            if (findId.userId !== req.user.id && req.user.role !== 'admin') {
                return res.status(403).json({ error: 'No autorizado.' });
            }
            if (findId.estado !== 'en_carrito')
                return res.status(400).json({ error: 'No se puede eliminar la orden ya que no se encuentra en el carrito.'
                });
            const deleted = orders.filter(order => order.id !== orderId);
            (0, ordersModel_1.save)(deleted);
            res.status(200).json({ message: 'Orden eliminada con éxito.', order: findId });
        }
        catch (error) {
            console.error("Error en deleteOrder:", error);
            next(error);
        } // Cierra try/catch
    } // Cierre deleteOrder
    static updateOrderStatus(req, res, next) {
        try {
            const orderId = req.params.id;
            const orders = (0, ordersModel_1.readDataBase)();
            const findOrder = orders.find(order => order.id === orderId);
            if (!findOrder) {
                return res.status(404).json({ error: "Orden no encontrada." });
            }
            if (findOrder.estado !== "en_carrito") { // no permitimos cambiar si ya fue procesada
                return res.status(403).json({
                    error: "Solo se pueden modificar órdenes en carrito.",
                });
            }
            const parsed = updateOrderStatusSchema.safeParse(req.body); // validamos con Zod lo que envía el cliente
            if (!parsed.success) { // por si falla la validación
                return res.status(400).json({ errors: parsed.error.format() });
            }
            findOrder.estado = parsed.data.estado; // .data es el body validado y limpio que devuelve safeParse cuando success === true.
            (0, ordersModel_1.save)(orders);
            res.status(200).json({
                message: "Estado de la orden actualizado",
                order: findOrder,
            });
        }
        catch (error) {
            console.error("Error en updateOrderStatus:", error);
            next(error);
        }
    }
} // Cierra clase
exports.ordersController = ordersController;
//# sourceMappingURL=ordersController.js.map