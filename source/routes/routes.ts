import { Router } from "express";
import { userController }  from '../controller/usersControllers';
import { ordersController } from "../controller/ordersController";
import { auth, isAdmin} from '../middleware/authMiddleware';

const router : Router = Router();

// rutas para los endpoints
router.post('/users/register', userController.register);
router.post('/users/login', userController.login);
router.get('/user/profile', auth, userController.viewProfile);

router.get('/orders', auth, isAdmin, ordersController.getOrders);   // Validamos que el usuario este autenticado y que solo admin pueda ver todas las ordenes
router.get('/orders/cart', auth, ordersController.getOrderUser);    // Para que el usuario pueda ver su carrito con las ordenes.
router.post('/orders', auth, ordersController.addOrders);           // Agregamos ordenes con el usuario ya logueado
router.put('/orders/:id', auth, ordersController.editOrder);        // Editamos la orden completa
router.delete('/orders/:id', auth, ordersController.deleteOrder);

export default router;
