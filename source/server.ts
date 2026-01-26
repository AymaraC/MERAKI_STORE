// archivo principal que levanta el servidor
//Esta línea es necesaria para que TypeScript sepa que req.user existe y evitar errores de tipos al compilar.
/// <reference path="./types/express.d.ts" />   
import 'dotenv/config';
import express, {Request, Response } from 'express';
import router from './routes/routes';
import { globalMiddleware } from './middleware/globalMiddleware';
import { errorHandler } from './middleware/errMiddleware';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: path.resolve(__dirname, '../.env') });
const PORT = process.env.PORT 

const app = express();

app.use(globalMiddleware);          // se ejecuta con TODAS las request
app.use(express.json());            // parsea JSON
app.use(cors());                       // para que pueda vincularse con otras páginas web.

app.use(express.static(path.join(__dirname, "../public")));

app.use(router);            // Utilizamos las rutas


app.use((req: Request, res: Response) => {      // Middleware 404 (no coincidió ninguna ruta)
    res.status(404).json({error: 'Endpoint no encontrado.'});
});

app.use(errorHandler)           // Corta el flujo(no llamas a next())

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`)
});
