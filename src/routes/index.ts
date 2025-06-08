import { Router } from 'express';
import authRoutes from './AuthRoute';
import usersRoutes from './UsersRoute';
import companiesRoutes from './CompaniesRoute';
import citiesRoutes from './CitiesRoute';
import resumesRoutes from './ResumesRoute';
import jobAdsRoutes from './JobAdsRoute';
import applicationsRoutes from './ApplicationsRoute';
import tagsRoutes from './TagsRoute';
import jobTagsRoutes from './JobTagsRoute';
import searchRoutes from './SearchRoute';

const mainRouter: Router = Router();

mainRouter.use('/auth', authRoutes);
mainRouter.use('/users', usersRoutes);
mainRouter.use('/companies', companiesRoutes);
mainRouter.use('/cities', citiesRoutes);
mainRouter.use('/resumes', resumesRoutes);
mainRouter.use('/jobads', jobAdsRoutes);
mainRouter.use('/applications', applicationsRoutes);
mainRouter.use('/tags', tagsRoutes);
mainRouter.use('/jobtags', jobTagsRoutes);
mainRouter.use('/search', searchRoutes);

export default mainRouter;
