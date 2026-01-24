import { Request, Response, NextFunction } from "express";
export declare function auth(req: Request, res: Response, next: NextFunction): Response<any, Record<string, any>> | undefined;
export declare function isAdmin(req: Request, res: Response, next: NextFunction): Response<any, Record<string, any>> | undefined;
//# sourceMappingURL=authMiddleware.d.ts.map