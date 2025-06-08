import ApplicationsController from '../controllers/ApplicationsController';
import ApplicationsServices from '../services/ApplicationsService';
import ApplicationsRepository from '../repositories/ApplicationsRepository';
import ResumesRepository from '../repositories/ResumesRepository';
import JobAdsRepository from '../repositories/JobAdsRepository';

const applicationsRepository = new ApplicationsRepository();
const resumesRepository = new ResumesRepository();
const jobAdsRepository = new JobAdsRepository();

const applicationsServices = new ApplicationsServices(
  resumesRepository,
  applicationsRepository,
  jobAdsRepository
);

const applicationsController = new ApplicationsController(applicationsServices);

export default applicationsController;
