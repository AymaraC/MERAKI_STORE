import express, { Router } from "express";
import {auth, isAdmin}  from '../middleware/authMiddleware';
import { ordersController } from "../controller/ordersController";


const app = express();

app.get('/orders', auth, isAdmin, ordersController.getOrders);   // Validamos que el usuario este autenticado y que solo admin pueda ver todas las ordenes
app.get('/orders/cart', auth, ordersController.getOrderUser);    // Para que el usuario pueda ver su carrito con las ordenes.



