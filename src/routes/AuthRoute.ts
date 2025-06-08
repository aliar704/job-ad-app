import { Router } from 'express';
import authMiddleware from '../middlewares/AuthMiddleware';
import { validateBody } from '../middlewares/validatorMiddleware';
import usersValidation from '../validations/usersValidation';
import { errorHandler } from '../utils/errorHandler';
import authController from '../containers/AuthContainer'; 

class AuthRoutes {
  public router: Router;

  constructor() {
    this.router = Router();
    this.setRoutes();
  }

  private setRoutes(): void {
    this.router.post(
      '/signup',
      validateBody(usersValidation.signupSchema),
      errorHandler(authController.signup)
    );

    this.router.post(
      '/login',
      validateBody(usersValidation.loginSchema),
      errorHandler(authController.login)
    );

    this.router.get(
      '/me',
      authMiddleware.authenticate,
      errorHandler(authController.me)
    );
  }
}

export default new AuthRoutes().router;
