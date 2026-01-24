"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalMiddleware = void 0;
const globalMiddleware = (req, res, next) => {
    const start = Date.now(); // guardamos cuanto entró la request, nos sirve para ver el momento de duración
    res.on("finish", () => {
        const duration = Date.now() - start; // calcula cuanto tiempo se tardo en responderle al cliente
        console.log(`${req.method} ${req.originalUrl} -> ${res.statusCode} (${duration}ms)` // nos muestra información útil
        );
    });
    next(); // pasamos al siguiente middleware o controller
};
exports.globalMiddleware = globalMiddleware;
//# sourceMappingURL=globalMiddleware.js.map