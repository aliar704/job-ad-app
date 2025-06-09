import UsersController from '../controllers/UsersController';
import UsersServices from '../services/UsersService';
import UsersRepository from '../repositories/UsersRepository'; 
import CitiesServices from '../services/CitiesServices';
import CitiesRepository from '../repositories/CitiesRepository';

const usersRepositoryInstance = new UsersRepository(); 
const citiesRepository = new CitiesRepository();
const citiesServices = new CitiesServices(citiesRepository);
const usersServices = new UsersServices(usersRepositoryInstance,citiesServices); 
const usersController = new UsersController(usersServices);

export default usersController;
