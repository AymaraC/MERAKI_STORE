import { Request, Response, NextFunction } from "express";
export declare class ordersController {
    static getOrders(req: Request, res: Response, next: NextFunction): void;
    static getOrderUser(req: Request, res: Response, next: NextFunction): Response<any, Record<string, any>> | undefined;
    static addOrders(req: Request, res: Response): Response<any, Record<string, any>> | undefined;
    static editOrder(req: Request, res: Response, next: NextFunction): Response<any, Record<string, any>> | undefined;
    static deleteOrder(req: Request, res: Response, next: NextFunction): Response<any, Record<string, any>> | undefined;
    static updateOrderStatus(req: Request, res: Response, next: NextFunction): Response<any, Record<string, any>> | undefined;
}
//# sourceMappingURL=ordersController.d.ts.map