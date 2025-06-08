import { Router } from 'express';
import citiesController from '../containers/CitiesContainer'; 
import authMiddleware from '../middlewares/AuthMiddleware';
import { validateBody, validateParams } from '../middlewares/validatorMiddleware';
import citiesValidation from '../validations/citiesValidation';
import { errorHandler } from '../utils/errorHandler';
import { paramsIdSchema } from '../validations/commonValidations';

class CitiesRoutes {
  public router: Router;

  constructor() {
    this.router = Router();
    this.setRoutes();
  }

  private setRoutes(): void {
    this.router.get(
      '/',
      authMiddleware.authenticate,
      errorHandler(citiesController.getAllCities)
    );

    this.router.post(
      '/',
      authMiddleware.authenticate,
      authMiddleware.hasRole('admin'),
      validateBody(citiesValidation.addCitySchema),
      errorHandler(citiesController.addCity)
    );

    this.router.delete(
      '/:id',
      authMiddleware.authenticate,
      authMiddleware.hasRole('admin'),
      validateParams(paramsIdSchema),
      errorHandler(citiesController.deleteCity)
    );
  }
}

export default new CitiesRoutes().router;
