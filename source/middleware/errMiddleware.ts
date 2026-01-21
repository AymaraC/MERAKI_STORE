// El middleware de error tiene 4 parametros y se utiliza por si hay algun error. Se ejecuta con el next del controller 
import { Request, Response, NextFunction } from "express";

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error("🔍 Error capturado por el middleware:", err);

  res.status(500).json({
    ok: false,
    mensaje: "Ocurrió un error en el servidor",
  });
}