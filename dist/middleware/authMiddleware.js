"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = auth;
exports.isAdmin = isAdmin;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// Función para verificar el token
function auth(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader)
        return res.status(401).json({ error: 'No autorizado.' });
    const token = authHeader.split(' ')[1]; // Sacamos la palabra Bearer que se encuentra delante del token 
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.SECRET_KEY);
        req.user = decoded;
        next();
    }
    catch (error) {
        res.status(401).json({
            error: 'Token inválido.'
        });
    }
    ;
}
// Función para verificar si es admin y otorgarle permisos especiales. Siempre se utiliza después de autenticación
function isAdmin(req, res, next) {
    if (!req.user)
        return res.status(401).json({ error: 'No autenticado.' });
    if (req.user.role !== 'admin')
        return res.status(403).json({ error: 'No autorizado' });
    next(); // Si todo esta ok pasa al controller.
}
//# sourceMappingURL=authMiddleware.js.map