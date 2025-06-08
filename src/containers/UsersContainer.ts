import UsersController from '../controllers/UsersController';
import UsersServices from '../services/UsersService';
import UsersRepository from '../repositories/UsersRepository'; // class, uppercase naming
import CitiesServices from '../services/CitiesServices';
import CitiesRepository from '../repositories/CitiesRepository';

const usersRepositoryInstance = new UsersRepository(); // instantiate here
const citiesRepository = new CitiesRepository();
const citiesServices = new CitiesServices(citiesRepository);
const usersServices = new UsersServices(usersRepositoryInstance,citiesServices); // pass the instance
const usersController = new UsersController(usersServices);

export default usersController;
