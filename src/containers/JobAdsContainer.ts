import JobAdsController from '../controllers/JobAdsController';
import JobAdsServices from '../services/JobAdsService';
import JobAdsRepository from '../repositories/JobAdsRepository';
import JobTagsRepository from '../repositories/JobTagsRepository';
import CompaniesRepository from '../repositories/CompaniesRepository';

const jobAdsRepository = new JobAdsRepository();
const jobTagsRepository = new JobTagsRepository();
const companiesRepository = new CompaniesRepository();

const jobAdsServices = new JobAdsServices(jobAdsRepository, jobTagsRepository, companiesRepository);

const jobAdsController = new JobAdsController(jobAdsServices);

export default jobAdsController;
