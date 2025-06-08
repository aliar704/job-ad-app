import JobTagsController from '../controllers/JobTagsController';
import JobTagsServices from '../services/JobTagsService';
import JobTagsRepository from '../repositories/JobTagsRepository';
import JobAdsRepository from '../repositories/JobAdsRepository';
import TagsRepository from '../repositories/TagsRepository';

const jobTagsRepository = new JobTagsRepository();
const jobAdsRepository = new JobAdsRepository();
const tagsRepository = new TagsRepository();

const jobTagsServices = new JobTagsServices(jobTagsRepository, jobAdsRepository, tagsRepository);
const jobTagsController = new JobTagsController(jobTagsServices);

export default jobTagsController;
