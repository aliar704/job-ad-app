import { Router } from 'express';
import applicationsController from '../containers/ApplicationsContainer'; 
import authMiddleware from '../middlewares/AuthMiddleware';
import { validateBody, validateParams } from '../middlewares/validatorMiddleware';
import applicationsValidation from '../validations/applicationsValidation';
import { errorHandler } from '../utils/errorHandler';
import { paramsIdSchema } from '../validations/commonValidations';

class ApplicationsRoutes {
  public router: Router;

  constructor() {
    this.router = Router();
    this.setRoutes();
  }

  private setRoutes(): void {
    this.router.post(
      '/',
      authMiddleware.authenticate,
      authMiddleware.hasRole('jobseeker'),
      validateBody(applicationsValidation.createApplicationSchema),
      errorHandler(applicationsController.createApplication)
    );

    this.router.get(
      '/list',
      authMiddleware.authenticate,
      authMiddleware.hasRole('jobseeker'),
      errorHandler(applicationsController.getApplicationsList)
    );
    this.router.get(
      '/',
      authMiddleware.authenticate,
      authMiddleware.hasRole('jobseeker'),
      errorHandler(applicationsController.getAllApplicationsInfo)
    );

    this.router.put(
      '/cancel/:id',
      authMiddleware.authenticate,
      authMiddleware.hasRole('jobseeker'),
      validateParams(paramsIdSchema),
      errorHandler(applicationsController.cancelApplication)
    );
    this.router.put(
      '/status/:id',
      authMiddleware.authenticate,
      authMiddleware.hasRole('employer'),
      validateParams(paramsIdSchema),
      validateBody(applicationsValidation.changeStatusSchema),
      errorHandler(applicationsController.changeApplication)
    );

    this.router.get(
      '/top',
      authMiddleware.authenticate,
      errorHandler(applicationsController.getTopJobSeekers)
    );
  }
}

export default new ApplicationsRoutes().router;
