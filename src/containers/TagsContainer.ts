import TagsController from '../controllers/TagsController';
import TagsServices from '../services/TagsService';
import TagsRepository from '../repositories/TagsRepository';

const tagsRepository = new TagsRepository();
const tagsServices = new TagsServices(tagsRepository);
const tagsController = new TagsController(tagsServices);

export default tagsController;
