// este middleware se ejecuta cada vez que entra una request, con app.use(globalMiddleware)
import { Request, Response, NextFunction } from "express";

export const globalMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();     // guardamos cuanto entró la request, nos sirve para ver el momento de duración

  res.on("finish", () => {      // se ejecuta luego que le responde al cliente
    const duration = Date.now() - start;        // calcula cuanto tiempo se tardo en responderle al cliente
    console.log(
      `${req.method} ${req.originalUrl} -> ${res.statusCode} (${duration}ms)`       // nos muestra información útil
    );
  });

  next();       // pasamos al siguiente middleware o controller

};

