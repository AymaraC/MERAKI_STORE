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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userController = exports.userRegister = void 0;
// Importamos los módulos necesarios
const usersModel_1 = require("../model/usersModel");
const uuid_1 = require("uuid");
const zod_1 = require("zod");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// Utilizamos zod para validar que los datos que entren estén correctos
exports.userRegister = zod_1.z.object({
    email: zod_1.z.string()
        .min(1, 'El email es obligatorio.')
        .pipe(zod_1.z.string()
        .email('Email inválido.'))
        .transform((email) => email.toLowerCase()),
    password: zod_1.z.string()
        .min(1, 'La contraseña es obligatoria.')
        .pipe(zod_1.z.string()
        .min(8, 'La contraseña debe tener como mínimo 8 caracteres')
        .regex(/[0-9]/, "Debe tener al menos un número")
        .regex(/[^a-zA-Z0-9]/, "Debe tener al menos un carácter especial"))
});
class userController {
    // Utilizamos static para no tener que crear una instancia en el Controller
    // Función para que se registre un usuario
    static register(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = exports.userRegister.safeParse(req.body);
                if (!result.success) {
                    res.status(400).json({ errors: result.error.issues });
                    return;
                }
                const { email, password } = result.data;
                const users = (0, usersModel_1.readUsers)();
                const emailExists = users.some(u => u.email === email);
                if (emailExists) {
                    res.status(400).json({ error: "El email ya se encuentra registrado." });
                    return;
                }
                const hashedPassword = yield bcrypt_1.default.hash(password, 10);
                const newUser = {
                    id: (0, uuid_1.v4)(),
                    email: email,
                    password: hashedPassword,
                    role: 'user'
                };
                users.push(newUser);
                (0, usersModel_1.saveUsers)(users);
                res.status(201).json({ message: "Usuario registrado correctamente" });
            }
            catch (error) {
                console.error("Error en register", error);
                next(error);
            }
        });
    }
    // Función para que el usuario inicie sesión
    static login(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                const dataBase = (0, usersModel_1.readUsers)();
                const user = dataBase.find(u => u.email === email);
                if (!user) {
                    res.status(401).json({ error: 'El usuario no existe' });
                    return;
                }
                // Comparamos la contraseña ingresada con la que tenemos en nuestra base de datos.
                const isValidPassword = yield bcrypt_1.default.compare(password, user.password);
                if (!isValidPassword) {
                    res.status(401).json({ error: 'Los datos ingresados no son válidos.' });
                    return;
                }
                const payload = { id: user.id, role: user.role }; // Creamos el payload con el id y el role.
                const token = jsonwebtoken_1.default.sign(payload, process.env.SECRET_KEY, { expiresIn: '1h' });
                res.json({ message: "Login exitoso",
                    token: token });
            }
            catch (error) {
                console.error("Error en login: ", error);
                next(error);
            }
        });
    }
    static viewProfile(req, res, next) {
        try {
            if (!req.user) {
                return res.status(401).json({ error: 'No estás autenticado.' });
            }
            const { id } = req.user;
            const userProfile = (0, usersModel_1.readUsers)();
            const findUser = userProfile.find(u => u.id === id.toString());
            if (!findUser) {
                res.status(403).json({ error: 'El usuario no se encuentra registrado.' });
                return;
            }
            const { password } = findUser, userWithoutPassword = __rest(findUser, ["password"]);
            res.json({ user: userWithoutPassword });
        }
        catch (error) {
            console.error("Error en viewProfile: ", error);
            next(error);
        }
    }
}
exports.userController = userController;
//# sourceMappingURL=usersControllers.js.map