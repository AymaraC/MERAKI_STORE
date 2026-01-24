"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
function errorHandler(err, req, res, next) {
    console.error("🔍 Error capturado por el middleware:", err);
    res.status(500).json({
        ok: false,
        mensaje: "Ocurrió un error en el servidor",
    });
}
//# sourceMappingURL=errMiddleware.js.map