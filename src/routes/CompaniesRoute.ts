import { Router } from 'express';
import companiesController from '../containers/CompaniesContainer'; 
import authMiddleware from '../middlewares/AuthMiddleware';
import companiesValidation from '../validations/companiesValidation';
import { validateBody, validateParams } from '../middlewares/validatorMiddleware';
import { errorHandler } from '../utils/errorHandler';
import { paramsIdSchema } from '../validations/commonValidations';

class CompaniesRoutes {
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
      validateBody(companiesValidation.createCompanySchema),
      errorHandler(companiesController.createCompany)
    );

    this.router.get(
      '/',
      authMiddleware.authenticate,
      errorHandler(companiesController.getCompaniesList)
    );

    this.router.get(
      '/user',
      authMiddleware.authenticate,
      authMiddleware.hasRole('employer'),
      errorHandler(companiesController.getUserCompaniesList)
    );

    this.router.get(
      '/city',
      authMiddleware.authenticate,
      errorHandler(companiesController.getCityCompaniesList)
    );

    this.router.get(
      '/:id',
      authMiddleware.authenticate,
      validateParams(paramsIdSchema),
      errorHandler(companiesController.getCompanyById)
    );

    this.router.put(
      '/:id',
      authMiddleware.authenticate,
      authMiddleware.hasRole('employer'),
      validateParams(paramsIdSchema),
      validateBody(companiesValidation.updateCompanySchema),
      errorHandler(companiesController.updateCompanyById)
    );

    this.router.put(
      '/delete/:id',
      authMiddleware.authenticate,
      authMiddleware.hasRole('employer', 'admin'),
      validateParams(paramsIdSchema),
      errorHandler(companiesController.deleteCompany)
    );
  }
}

export default new CompaniesRoutes().router;
