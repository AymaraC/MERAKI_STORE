import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';
export declare const userRegister: z.ZodObject<{
    email: z.ZodPipe<z.ZodPipe<z.ZodString, z.ZodString>, z.ZodTransform<string, string>>;
    password: z.ZodPipe<z.ZodString, z.ZodString>;
}, z.core.$strip>;
export declare class userController {
    static register(req: Request, res: Response, next: NextFunction): Promise<void>;
    static login(req: Request, res: Response, next: NextFunction): Promise<void>;
    static viewProfile(req: Request, res: Response, next: NextFunction): Response<any, Record<string, any>> | undefined;
}
//# sourceMappingURL=usersControllers.d.ts.map