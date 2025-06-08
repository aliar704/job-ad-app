import { IUsersRepository } from '../types/repositories';
import { LoginDTO, SignupDTO, User } from '../types/dataTypes/userData';
import { ConflictException } from '../exceptions/conflict-exception';
import { InternalException } from '../exceptions/internal-exception';
import { NotFoundException } from '../exceptions/not-found-exception';
import { UnauthorizedException } from '../exceptions/unauthorized-exception';
import authManager from '../utils/AuthManager';
import CitiesServices from './CitiesServices';
import { normalizeSignupInput } from '../utils/normalizationUtils';
import { ErrorCode } from '../types/errorCodes';
import { City } from '../types/dataTypes/cityData';

class AuthServices {
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
  async signupService(data: SignupDTO): Promise<User> {
    const email = data.email.toLowerCase();
    const existingUser = await this.usersRepository.findUser(email);
    if (existingUser) {
      throw new ConflictException('Email already exists!', ErrorCode.CONFLICT_SIGNUP_EXCEPTION);
    }
    const city = await this.resolveCity(data.city);
    data.city = city.id;

    const normalizedData = normalizeSignupInput(data);

    const password_hash = await authManager.hashPassword(normalizedData.password!);

    normalizedData.password_hash = password_hash;
    delete normalizedData.password;

    try {
      const createdUser = await this.usersRepository.createUser(normalizedData);
      return createdUser;
    } catch {
      throw new InternalException('Failed to create user!', ErrorCode.INTERNAL_DATABASE_EXCEPTION);
    }
  }

  async loginService(data: LoginDTO) {
    const foundUserResult = await this.usersRepository.findUser(data.email.toLowerCase());

    if (!foundUserResult) {
      throw new NotFoundException('User not found!', ErrorCode.NOT_FOUND_USER_EXCEPTION);
    }

    const passValidation = await authManager.comparePassword(
      data.password,
      foundUserResult.password_hash
    );

    if (!passValidation) {
      throw new UnauthorizedException(
        'Wrong Email or Password!',
        ErrorCode.UNAUTHORIZED_PASSWORD_EXCEPTION
      );
    }

    const token = await authManager.generateToken(foundUserResult.id);

    return { foundUserResult, token };
  }
}

export default AuthServices;
