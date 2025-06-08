import CompaniesController from '../controllers/CompaniesController';
import CompaniesServices from '../services/CompaniesService';
import CitiesServices from '../services/CitiesServices';
import CompaniesRepository from '../repositories/CompaniesRepository';
import CitiesRepository from '../repositories/CitiesRepository';

const companiesRepository = new CompaniesRepository();
const citiesRepository = new CitiesRepository();
const citiesServices = new CitiesServices(citiesRepository);
const companiesServices = new CompaniesServices(companiesRepository, citiesServices);
const companiesController = new CompaniesController(companiesServices);

export default companiesController;
