import { Router } from 'express';
import tagsController from '../containers/TagsContainer'; 
import authMiddleware from '../middlewares/AuthMiddleware';
import { validateBody, validateParams } from '../middlewares/validatorMiddleware';
import tagsValidation from '../validations/tagsValidation';
import { errorHandler } from '../utils/errorHandler';
import { paramsIdSchema } from '../validations/commonValidations';

class TagsRoutes {
  public router: Router;

  constructor() {
    this.router = Router();
    this.setRoutes();
  }

  private setRoutes(): void {
    this.router.post(
      '/',
      authMiddleware.authenticate,
      authMiddleware.hasRole('employer','admin'),
      validateBody(tagsValidation.addTagSchema),
      errorHandler(tagsController.addTag)
    );

    this.router.get(
      '/',
      authMiddleware.authenticate,
      errorHandler(tagsController.getAllTags)
    );

    this.router.delete(
      '/:id',
      authMiddleware.authenticate,
      authMiddleware.hasRole('employer','admin'),
      validateParams(paramsIdSchema),
      errorHandler(tagsController.deleteTag)
    );
  }
}

export default new TagsRoutes().router;
