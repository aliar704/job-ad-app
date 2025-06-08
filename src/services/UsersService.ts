import { NotFoundException } from '../exceptions/not-found-exception';
import { ErrorCode } from '../types/errorCodes';
import { UpdateUserDTO, User } from '../types/dataTypes/userData';
import { IUsersRepository } from '../types/repositories';
import CitiesServices from './CitiesServices';
import { City } from '../types/dataTypes/cityData';
import { normalizeUserUpdateInput } from '../utils/normalizationUtils';

class UsersServices {
  private usersRepository: IUsersRepository;
  private citiesServices: CitiesServices;

  constructor(usersRepository: IUsersRepository, citiesServices: CitiesServices) {
    this.usersRepository = usersRepository;
    this.citiesServices = citiesServices;
  }

  private async resolveCity(cityInput: string | number): Promise<City> {
    let city = await this.citiesServices.findCity(cityInput);
    if (!city) {
      if (typeof cityInput === 'string') {
        city = await this.citiesServices.addCity({ name: cityInput.toLowerCase() });
      } else {
        throw new NotFoundException('City not found', ErrorCode.NOT_FOUND_CITY_EXCEPTION);
      }
    }
    return city;
  }
  async getUsersList(): Promise<User[]> {
    return this.usersRepository.listUsers();
  }

  async getUserById(id: number): Promise<User> {
    const foundUser = await this.usersRepository.findUser(id);
    if (!foundUser) {
      throw new NotFoundException('User not found!', ErrorCode.NOT_FOUND_USER_EXCEPTION);
    }
    return foundUser;
  }

  async updateUserById(loggedUserId: number, data: UpdateUserDTO): Promise<User> {
    if (data.city) {
      const city = await this.resolveCity(data.city);
      data.city = city.id;
    }
    const normalizedData = normalizeUserUpdateInput(data);

    const foundUser = await this.usersRepository.findUser(loggedUserId);
    if (!foundUser) {
      throw new NotFoundException('User not found!', ErrorCode.NOT_FOUND_USER_EXCEPTION);
    }
    return this.usersRepository.updateUser(loggedUserId, normalizedData);
  }

  async deleteLoggedUser(loggedUserId: number): Promise<User> {
    return this.usersRepository.softDeleteUser(loggedUserId);
  }

  async deleteUserByIdAdmin(userId: number): Promise<User> {
    const foundUser = await this.usersRepository.findUser(userId);
    if (!foundUser) {
      throw new NotFoundException('User not found!', ErrorCode.NOT_FOUND_USER_EXCEPTION);
    }
    return this.usersRepository.softDeleteUser(userId);
  }
}

export default UsersServices;
