import { Router } from 'express';
import jobTagsController from '../containers/JobTagsContainer'; 
import authMiddleware from '../middlewares/AuthMiddleware';
import { validateBody, validateParams } from '../middlewares/validatorMiddleware';
import jobTagsValidation from '../validations/jobTagsValidation';
import { errorHandler } from '../utils/errorHandler';
import { paramsIdSchema } from '../validations/commonValidations';

class JobTagsRoutes {
  public router: Router;

  constructor() {
    this.router = Router();
    this.setRoutes();
  }

  private setRoutes(): void {
    this.router.post(
      '/:id',
      authMiddleware.authenticate,
      authMiddleware.hasRole('employer'),
      validateParams(paramsIdSchema),
      validateBody(jobTagsValidation.addJobTagSchema),
      errorHandler(jobTagsController.addJobTag)
    );

    this.router.get(
      '/',
      authMiddleware.authenticate,
      errorHandler(jobTagsController.getAllJobTags)
    );
    this.router.get(
      '/list',
      authMiddleware.authenticate,
      errorHandler(jobTagsController.getJobAdsWithTags)
    );
    this.router.get(
      '/:id',
      authMiddleware.authenticate,
      errorHandler(jobTagsController.getFullJobTag)
    );

    this.router.delete(
      '/:id',
      authMiddleware.authenticate,
      authMiddleware.hasRole('employer'),
      validateParams(paramsIdSchema),
      errorHandler(jobTagsController.deleteJobTag)
    );
  }
}

export default new JobTagsRoutes().router;
