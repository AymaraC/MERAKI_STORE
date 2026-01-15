import fs from 'fs';
import path from 'path';

const filePath = path.join(__dirname, '../database/users.json');

export interface User {
  id: string;
  email: string;
  password: string;
}

export function readUsers() : User[] {                               // Función para leer los usuarios en la base de datos
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data);
}

export function saveUsers(users: User[]) : void {
    fs.writeFileSync(filePath, JSON.stringify(users, null, 2)); 
}







