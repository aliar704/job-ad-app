import { NextFunction, Request, Response } from 'express';
import AuthServices from '../services/AuthService';

class AuthController {
  private authServices: AuthServices;

  constructor(authServices: AuthServices) {
    this.authServices = authServices;
  }

  signup = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.authServices.signupService(req.body);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.authServices.loginService(req.body);
      res.json(result);
    } catch (error) {
      next(error);
    }
  };

  me = async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.json(req.user);
    } catch (error) {
      next(error);
    }
  };
}

export default AuthController;
