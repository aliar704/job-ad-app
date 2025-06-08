import { Router } from 'express';
import usersController from '../containers/UsersContainer'; 
import { validateBody, validateParams } from '../middlewares/validatorMiddleware';
import usersValidation from '../validations/usersValidation';
import authMiddleware from '../middlewares/AuthMiddleware';
import { errorHandler } from '../utils/errorHandler';
import { paramsIdSchema } from '../validations/commonValidations';

class UsersRoutes {
  public router: Router;

  constructor() {
    this.router = Router();
    this.setRoutes();
  }

  private setRoutes(): void {
    this.router.get(
      '/',
      authMiddleware.authenticate,
      authMiddleware.hasRole('admin'),
      errorHandler(usersController.getUsersList)
    );

    this.router.get(
      '/:id',
      authMiddleware.authenticate,
      authMiddleware.hasRole('admin'),
      validateParams(paramsIdSchema),
      errorHandler(usersController.getUserById)
    );

    this.router.put(
      '/update',
      authMiddleware.authenticate,
      validateBody(usersValidation.updateSchema),
      errorHandler(usersController.updateUserById)
    );

    this.router.put(
      '/delete',
      authMiddleware.authenticate,
      errorHandler(usersController.deleteLoggedUser)
    );

    this.router.put(
      '/delete/:id',
      authMiddleware.authenticate,
      authMiddleware.hasRole('admin'),
      validateParams(paramsIdSchema),
      errorHandler(usersController.deleteUserById)
    );
  }
}

export default new UsersRoutes().router;
