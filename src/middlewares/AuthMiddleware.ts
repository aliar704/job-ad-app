import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import pool from '../db/postgres';
import { JWT_SECRET } from '../secrets';
import { ErrorCode } from '../types/errorCodes';
import { UnauthorizedException } from '../exceptions/unauthorized-exception';
import { NotFoundException } from '../exceptions/not-found-exception';
import { ForbiddenException } from '../exceptions/forbidden-exception';
import { User } from '../types/dataTypes/userData';

class AuthMiddleware {
  public async authenticate(req: Request, res: Response, next: NextFunction): Promise<void> {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException(
        'Access denied! token invalid',
        ErrorCode.UNAUTHORIZED_TOKEN_EXCEPTION
      );
    }

    const token = authHeader.split(' ')[1];

    try {
      const payload = jwt.verify(token, JWT_SECRET) as { userId: number };

      const query = `SELECT * FROM users WHERE id = $1 AND deleted_at IS NULL`;
      const values = [payload.userId];
      const result = await pool.query(query, values);
      const user: User = result.rows[0];

      if (!user)
        throw new NotFoundException(
          'Can not access because User not found or already deleted!',
          ErrorCode.NOT_FOUND_USER_EXCEPTION
        );
      req.user = user;
      next();
    } catch (error) {
      throw error;
    }
  }
  public hasRole(...allowedRoles: string[]) {
    return (req: Request, res: Response, next: NextFunction): void => {
      const userRole = req.user?.role;
      if (!allowedRoles.includes(userRole)) {
        throw new ForbiddenException(
          `Access denied! Requires role(s): ${allowedRoles.join(', ')}`,
          ErrorCode.FORBIDDEN_EXCEPTION
        );
      }
      next();
    };
  }
}

export default new AuthMiddleware();
