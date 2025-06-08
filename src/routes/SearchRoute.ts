import { Router } from 'express';
import searchController from '../containers/SearchContainer';
import authMiddleware from '../middlewares/AuthMiddleware';
import { errorHandler } from '../utils/errorHandler';

class SearchRoutes {
  public router: Router;

  constructor() {
    this.router = Router();
    this.setRoutes();
  }

  private setRoutes(): void {
    this.router.get(
      '/',
      authMiddleware.authenticate,
      errorHandler(searchController.search)
    );
  }
}

export default new SearchRoutes().router;
