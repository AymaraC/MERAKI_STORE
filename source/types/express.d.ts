/** Este archivo extiende los tipos de Express para TypeScript.
Por defecto, TypeScript no sabe que la propiedad `user` existe en `req`.
Al usar autenticación (por ejemplo con JWT), solemos guardar información del usuario en `req.user` dentro de nuestros middlewares.
Con este archivo, TypeScript ahora reconoce que `req.user` puede existir y tiene los campos `id`, `username` y opcionalmente `role`.
Esto evita errores de TypeScript cuando hacemos cosas como: const userId = req.user.id
- `user` es opcional (`?`) porque podría no existir si el middleware de autenticación no se ejecutó o el usuario no está logueado.
Este archivo no ejecuta código, solo define tipos para TS. */
import { Request } from "express";

declare module "express-serve-static-core" {
  interface Request {
    user?: {
      id: string;
      role?: string;
    };
  }
}
