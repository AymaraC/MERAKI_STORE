"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const usersControllers_1 = require("../controller/usersControllers");
const ordersController_1 = require("../controller/ordersController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
// rutas para los endpoints
router.post('/users/register', usersControllers_1.userController.register);
router.post('/users/login', usersControllers_1.userController.login);
router.get('/user/profile', authMiddleware_1.auth, usersControllers_1.userController.viewProfile);
router.get('/orders', authMiddleware_1.auth, authMiddleware_1.isAdmin, ordersController_1.ordersController.getOrders); // Validamos que el usuario este autenticado y que solo admin pueda ver todas las ordenes
router.get('/orders/cart', authMiddleware_1.auth, ordersController_1.ordersController.getOrderUser); // Para que el usuario pueda ver su carrito con las ordenes.
router.post('/orders', authMiddleware_1.auth, ordersController_1.ordersController.addOrders); // Agregamos ordenes con el usuario ya logueado
router.put('/orders/:id', authMiddleware_1.auth, ordersController_1.ordersController.editOrder); // Editamos la orden completa
router.patch('/orders/:id/status', authMiddleware_1.auth, authMiddleware_1.isAdmin, ordersController_1.ordersController.updateOrderStatus); // Admin cambia el estado de la orden
router.delete('/orders/:id', authMiddleware_1.auth, ordersController_1.ordersController.deleteOrder);
exports.default = router;
//# sourceMappingURL=routes.js.map