import ResumesController from '../controllers/ResumesController';
import ResumesServices from '../services/ResumesService';
import ResumesRepository from '../repositories/ResumesRepository';

const resumesRepository = new ResumesRepository();
const resumesServices = new ResumesServices(resumesRepository);
const resumesController = new ResumesController(resumesServices);

export default resumesController;
