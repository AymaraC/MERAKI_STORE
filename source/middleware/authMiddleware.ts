// verifyToken, isAdmin
import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';

// Función para verificar el token
export function auth(req: Request, res: Response, next: NextFunction) {
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


// Función para verificar si es admin y otorgarle permisos especiales. Siempre se utiliza después de autenticación
export function isAdmin(req: Request, res: Response, next: NextFunction) {
    if(!req.user) return res.status(401).json({error: 'No autenticado.'});

    if(req.user.role !== 'admin') return res.status(403).json({error: 'No autorizado'});

    next();      // Si todo esta ok pasa al controller.
}

