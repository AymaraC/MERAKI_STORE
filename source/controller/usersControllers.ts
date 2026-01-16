// Importamos los módulos necesarios
import { readUsers, saveUsers} from "../model/usersModel";
import { Request, Response} from 'express';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';
import bcrypt from "bcrypt";
import  { User } from "../model/usersModel";
import jwt from 'jsonwebtoken';

// Utilizamos zod para validar que los datos que entren estén correctos
export const userRegister = z.object({
    email: z.string()
    .email('Email inválido.')
    .transform((email) => email.toLowerCase()),

    password: z.string()
    .min(8, 'La contraseña debe tener como mínimo 8 caracteres')
    .regex(/[0-9]/, "Debe tener al menos un número")
    .regex(/[^a-zA-Z0-9]/, "Debe tener al menos un carácter especial"),

});

export class userController {
    // Utilizamos static para no tener que crear una instancia en el Controller
    
    // Función para que se registre un usuario
    static async register(req: Request, res: Response) :  Promise<void> {
        const result = userRegister.safeParse(req.body);
    
    if (!result.success) { 
     res.status(400).json({ errors: result.error.issues });
     return;
    }    
        
    const { email, password } = result.data;
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser : User = {
        id: uuidv4(),
        email: email,
        password: hashedPassword,
        role: 'user'
    }

    const users = readUsers();
    users.push(newUser);
    saveUsers(users)
    res.status(201).json({ message: "Usuario registrado correctamente" });

    }   

    // Función para que el usuario inicie sesión
    static async login (req: Request, res: Response) : Promise<void> {
        const {email, password} = req.body;
        const dataBase = readUsers();
        const user = dataBase.find(u => u.email === email);

        if(!user) {
            res.status(401).json({error: 'El usuario no existe'});
            return;
        }

        // Comparamos la contraseña ingresada con la que tenemos en nuestra base de datos.
        const isValidPassword = await bcrypt.compare(password, user.password);        
        if(!isValidPassword) {
            res.status(401).json({error: 'Los datos ingresados no son válidos.'})
            return;
        }

        const payload = {id: user.id, role: user.role}          // Creamos el payload con el id y el role.
        const token = jwt.sign(payload, process.env.SECRET_KEY as string, {expiresIn: '1h'});
        res.json({  message: "Login exitoso",
                    token: token  });
    }

    static viewProfile(req: Request, res: Response) {
        if (!req.user) {
        return res.status(401).json({ error: 'No estás autenticado.' });
        }

        const { id }= req.user
        const userProfile = readUsers();
        const findUser = userProfile.find(u => u.id === id.toString());
        if(!findUser) {
            res.status(400).json({error: 'El usuario no se encuentra registrado.'});
            return
        }
        const { password, ...userWithoutPassword } = findUser;
        res.json({findUser})
    }

}











