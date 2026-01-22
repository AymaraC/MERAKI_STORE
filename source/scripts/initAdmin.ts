// archivo para crear un usuario 'admin'
import { readUsers, saveUsers, User } from '../model/usersModel';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';        

// creamos un usuario admin sino existe
async function createAdmin() {
    const users = readUsers();      // leemos la DB de los usuarios
    const email = "admin@example.com";      // definimos el email que va a tener el admin
    const exists = users.some(u => u.email === email);      // verificamos que no haya un usuario con ese mismo email

    if (!exists) {
        const hashedPassword = await bcrypt.hash("SuperSecreto123!", 10);       // sino existe, generamos la contraseña hasheada 
        const newAdmin: User = {
            id: uuidv4(),
            email,
            password: hashedPassword,
            role: 'admin'
        };

        users.push(newAdmin);   // agregamos el nuevo admin a la lista de usuarios
        saveUsers(users);
        console.log("Admin creado:", email);

    } else {
        console.log("El admin ya existe");
    }
}

createAdmin();
