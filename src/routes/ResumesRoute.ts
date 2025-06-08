import { Router } from 'express';
import resumesController from '../containers/ResumesContainer'; 
import authMiddleware from '../middlewares/AuthMiddleware';
import { validateBody, validateParams } from '../middlewares/validatorMiddleware';
import resumesValidation from '../validations/resumesValidation';
import { errorHandler } from '../utils/errorHandler';
import { paramsIdSchema } from '../validations/commonValidations';
import upload from '../middlewares/UploadMiddleware';

class ResumesRoutes {
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
      validateBody(resumesValidation.createResumeSchema),
      upload.single('resume'),
      errorHandler(resumesController.createResume)
    );
    this.router.get(
      '/list',
      authMiddleware.authenticate,
      authMiddleware.hasRole('jobseeker'),
      errorHandler(resumesController.getResumesList)
    );
    this.router.put(
      '/:id',
      authMiddleware.authenticate,
      authMiddleware.hasRole('jobseeker'),
      validateParams(paramsIdSchema),
      validateBody(resumesValidation.updateResumeSchema),
      errorHandler(resumesController.updateResume)
    );
    this.router.put(
      '/delete/:id',
      authMiddleware.authenticate,
      authMiddleware.hasRole('jobseeker'),
      validateParams(paramsIdSchema),
      errorHandler(resumesController.deleteResume)
    );
  }
}

export default new ResumesRoutes().router;
