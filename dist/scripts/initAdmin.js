"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// archivo para crear un usuario 'admin'
const usersModel_1 = require("../model/usersModel");
const uuid_1 = require("uuid");
const bcrypt_1 = __importDefault(require("bcrypt"));
// creamos un usuario admin sino existe
function createAdmin() {
    return __awaiter(this, void 0, void 0, function* () {
        const users = (0, usersModel_1.readUsers)(); // leemos la DB de los usuarios
        const email = "admin@example.com"; // definimos el email que va a tener el admin
        const exists = users.some(u => u.email === email); // verificamos que no haya un usuario con ese mismo email
        if (!exists) {
            const hashedPassword = yield bcrypt_1.default.hash("SuperSecreto123!", 10); // sino existe, generamos la contraseña hasheada 
            const newAdmin = {
                id: (0, uuid_1.v4)(),
                email,
                password: hashedPassword,
                role: 'admin'
            };
            users.push(newAdmin); // agregamos el nuevo admin a la lista de usuarios
            (0, usersModel_1.saveUsers)(users);
            console.log("Admin creado:", email);
        }
        else {
            console.log("El admin ya existe");
        }
    });
}
createAdmin();
//# sourceMappingURL=initAdmin.js.map