import CitiesController from '../controllers/CitiesController';
import CitiesServices from '../services/CitiesServices';
import CitiesRepository from '../repositories/CitiesRepository';

const citiesRepository = new CitiesRepository();
const citiesServices = new CitiesServices(citiesRepository);
const citiesController = new CitiesController(citiesServices);

export default citiesController;
