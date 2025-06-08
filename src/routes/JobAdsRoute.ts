import { Router } from 'express';
import jobAdsController from '../containers/JobAdsContainer';
import authMiddleware from '../middlewares/AuthMiddleware';
import { validateBody, validateParams } from '../middlewares/validatorMiddleware';
import jobAdsValidation from '../validations/jobAdsValidation';
import { errorHandler } from '../utils/errorHandler';
import { paramsIdSchema } from '../validations/commonValidations';

class JobAdsRoutes {
  public router: Router;

  constructor() {
    this.router = Router();
    this.setRoutes();
  }

  private setRoutes(): void {
    this.router.post(
      '/',
      authMiddleware.authenticate,
      authMiddleware.hasRole('employer'),
      validateBody(jobAdsValidation.createJobAdSchema),
      errorHandler(jobAdsController.createJobAd)
    );

    this.router.get(
      '/user',
      authMiddleware.authenticate,
      authMiddleware.hasRole('employer'),
      errorHandler(jobAdsController.getUserJobAdsList)
    );
    this.router.get(
      '/applications/:id',
      authMiddleware.authenticate,
      authMiddleware.hasRole('employer'),
      validateParams(paramsIdSchema),
      errorHandler(jobAdsController.getJobAdApplications)
    );

    this.router.get(
      '/list',
      authMiddleware.authenticate,
      errorHandler(jobAdsController.getJobAdsList)
    );

    this.router.put(
      '/:id',
      authMiddleware.authenticate,
      authMiddleware.hasRole('employer'),
      validateParams(paramsIdSchema),
      validateBody(jobAdsValidation.updateJobAdSchema),
      errorHandler(jobAdsController.updateJobAd)
    );

    this.router.put(
      '/delete/:id',
      authMiddleware.authenticate,
      authMiddleware.hasRole('employer'),
      validateParams(paramsIdSchema),
      errorHandler(jobAdsController.deleteJobAd)
    );

    this.router.get(
      '/top',
      authMiddleware.authenticate,
      errorHandler(jobAdsController.getTopJobAds)
    );
  }
}

export default new JobAdsRoutes().router;
