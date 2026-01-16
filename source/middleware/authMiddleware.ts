// verifyToken, isAdmin
import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';

// Función para verificar el token
function verifyToken(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    if(!authHeader) return res.status(401).json({error: 'No autorizado.'});

    const token = authHeader.split(' ')[1]          // Sacamos la palabra Bearer que se encuentra delante del token 
    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY as string) as {            
            id: string; role: "user" | "admin"
        }
        req.user = decoded
        
        next();

    } catch(error) {
        res.status(401).json({
            error: 'Token inválido.'
        });
    };
}





