import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types/index.js';
export declare const authenticate: (req: AuthRequest, res: Response, next: NextFunction) => Promise<any>;
export declare const authorize: (...roles: string[]) => (req: AuthRequest, res: Response, next: NextFunction) => any;
export declare const optionalAuth: (req: AuthRequest, res: Response, next: NextFunction) => Promise<any>;
//# sourceMappingURL=auth.d.ts.map