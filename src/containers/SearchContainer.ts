import SearchController from '../controllers/SearchController';
import SearchServices from '../services/SearchService';
import SearchRepository from '../repositories/SearchRepository';

const searchRepository = new SearchRepository();
const searchServices = new SearchServices(searchRepository);
const searchController = new SearchController(searchServices);

export default searchController;
