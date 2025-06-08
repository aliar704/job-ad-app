import AuthController from '../controllers/AuthController';
import AuthServices from '../services/AuthService';
import UsersRepository from '../repositories/UsersRepository';
import CitiesRepository from '../repositories/CitiesRepository';
import CitiesServices from '../services/CitiesServices';

const usersRepository = new UsersRepository();
const citiesRepository = new CitiesRepository();
const citiesServices = new CitiesServices(citiesRepository);
const authServices = new AuthServices(usersRepository, citiesServices);
const authController = new AuthController(authServices);

export default authController;
