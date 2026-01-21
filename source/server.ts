// archivo principal que levanta el servidor
import express, {Request, Response, NextFunction } from 'express';
import router from './routes/routes';
import { globalMiddleware } from './middleware/globalMiddleware';
import { errorHandler } from './middleware/errMiddleware';
import cors from 'cors';

const PORT = process.env.PORT;
const app = express();

app.use(globalMiddleware);          // se ejecuta con TODAS las request
app.use(express.json());            // parsea JSON
app.use(cors());                       // para que pueda vincularse con otras páginas web.
app.use(router);            // Utilizamos las rutas


app.use((req: Request, res: Response) => {      // Middleware 404 (no coincidió ninguna ruta)
    res.status(404).json({error: 'Endpoint no encontrado.'});
});

app.use(errorHandler)           // Corta el flujo(no llamas a next())

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`)
});
