"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// archivo principal que levanta el servidor
/// <reference path="./types/express.d.ts" />
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const routes_1 = __importDefault(require("./routes/routes"));
const globalMiddleware_1 = require("./middleware/globalMiddleware");
const errMiddleware_1 = require("./middleware/errMiddleware");
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, '../.env') });
const PORT = process.env.PORT;
const app = (0, express_1.default)();
app.use(globalMiddleware_1.globalMiddleware); // se ejecuta con TODAS las request
app.use(express_1.default.json()); // parsea JSON
app.use((0, cors_1.default)()); // para que pueda vincularse con otras páginas web.
app.use(express_1.default.static(path_1.default.join(__dirname, "../public")));
app.use(routes_1.default); // Utilizamos las rutas
app.use((req, res) => {
    res.status(404).json({ error: 'Endpoint no encontrado.' });
});
app.use(errMiddleware_1.errorHandler); // Corta el flujo(no llamas a next())
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
//# sourceMappingURL=server.js.map