import AuthServices from '../services/AuthService';
import { ConflictException } from '../exceptions/conflict-exception';
import { InternalException } from '../exceptions/internal-exception';
import { NotFoundException } from '../exceptions/not-found-exception';
import { UnauthorizedException } from '../exceptions/unauthorized-exception';
import authManager from '../utils/AuthManager';
import { normalizeSignupInput } from '../utils/normalizationUtils';
import { SignupDTO, LoginDTO, User, Role, NormalizedUserInput } from '../types/dataTypes/userData';
import CitiesServices from '../services/CitiesServices';
import { City } from '../types/dataTypes/cityData';

// Mocks
jest.mock('../utils/AuthManager');
jest.mock('../utils/normalizationUtils');

const mockRepository = {
  findUser: jest.fn(),
  createUser: jest.fn(),
};

const mockCitiesServices = {
  findCity: jest.fn(),
  addCity: jest.fn(),
};

const authService = new AuthServices(
  mockRepository as any,
  mockCitiesServices as unknown as CitiesServices
);

// Test data
const input: SignupDTO = {
  email: 'Test@Email.com',
  password: 'Password123',
  full_name: 'Test User',
  role: Role.JOBSEEKER,
  phone: '1234567890',
  city: 'paris',
  birth_date: new Date(),
};

const normalizedInput: NormalizedUserInput = {
  email: 'test@email.com',
  password: 'Password123',
  full_name: 'test user',
  role: Role.JOBSEEKER,
  phone: '1234567890',
  city_id: 1,
  birth_date: new Date(),
  password_hash: undefined,
};

const fakeUser: User = {
  id: 1,
  email: normalizedInput.email!,
  password_hash: 'hashedpassword',
  full_name: normalizedInput.full_name!,
  role: normalizedInput.role!,
  phone: normalizedInput.phone!,
  city_id: 1,
  birth_date: normalizedInput.birth_date!,
  created_at: new Date(),
  deleted_at: null,
};

const fakeCity: City = {
  id: 1,
  name: 'paris',
  country: 'france',
  created_at: new Date(),
};

describe('AuthServices', () => {
  afterEach(() => jest.clearAllMocks());

  describe('signupService', () => {
    it('creates a user successfully', async () => {
      mockRepository.findUser.mockResolvedValueOnce(null);
      mockCitiesServices.findCity.mockResolvedValueOnce(null);
      mockCitiesServices.addCity.mockResolvedValueOnce(fakeCity);
      (normalizeSignupInput as jest.Mock).mockReturnValue({ ...normalizedInput });
      (authManager.hashPassword as jest.Mock).mockResolvedValueOnce('hashedpassword');
      mockRepository.createUser.mockResolvedValueOnce(fakeUser);

      const result = await authService.signupService({ ...input });
      expect(mockRepository.findUser).toHaveBeenCalledWith(normalizedInput.email);
      expect(mockCitiesServices.findCity).toHaveBeenCalledWith('paris');
      expect(mockCitiesServices.addCity).toHaveBeenCalledWith({ name: 'paris' });

      expect(normalizeSignupInput).toHaveBeenCalledWith({
        ...input,
        city: fakeCity.id,
      });
      expect(authManager.hashPassword).toHaveBeenCalledWith(normalizedInput.password);
      const expectedData = { ...normalizedInput, password_hash: 'hashedpassword' };
      delete expectedData.password;
      expect(mockRepository.createUser).toHaveBeenCalledWith(expectedData);

      expect(result).toEqual(fakeUser);
    });

    it('throws ConflictException if email exists', async () => {
      mockRepository.findUser.mockResolvedValueOnce(fakeUser);
      await expect(authService.signupService({ ...input })).rejects.toThrow(ConflictException);
      expect(mockRepository.findUser).toHaveBeenCalledWith(normalizedInput.email);
    });

    it('throws InternalException on DB error', async () => {
      mockRepository.findUser.mockResolvedValueOnce(null);
      mockCitiesServices.findCity.mockResolvedValueOnce(null);
      mockCitiesServices.addCity.mockResolvedValueOnce(fakeCity);
      (normalizeSignupInput as jest.Mock).mockReturnValue({ ...normalizedInput });
      (authManager.hashPassword as jest.Mock).mockResolvedValueOnce('hashedpassword');
      mockRepository.createUser.mockRejectedValueOnce(new Error('DB Error'));
      await expect(authService.signupService({ ...input })).rejects.toThrow(InternalException);
      expect(mockRepository.findUser).toHaveBeenCalledWith(normalizedInput.email);
      expect(mockCitiesServices.findCity).toHaveBeenCalledWith('paris');
      expect(mockCitiesServices.addCity).toHaveBeenCalledWith({ name: 'paris' });
      expect(normalizeSignupInput).toHaveBeenCalledWith({
        ...input,
        city: fakeCity.id,
      });
      expect(authManager.hashPassword).toHaveBeenCalledWith(normalizedInput.password);
      const expectedData = { ...normalizedInput, password_hash: 'hashedpassword' };
      delete expectedData.password;
      expect(mockRepository.createUser).toHaveBeenCalledWith(expectedData);
    });

    it('throws NotFoundException if city ID is not found', async () => {
      const inputWithCityId: SignupDTO = { ...input, city: 999 }; 
      mockCitiesServices.findCity.mockResolvedValueOnce(null);

      await expect(authService.signupService(inputWithCityId)).rejects.toThrow(NotFoundException);
      expect(mockCitiesServices.findCity).toHaveBeenCalledWith(999);
    });
  });

  describe('loginService', () => {
    const loginInput: LoginDTO = {
      email: 'test@email.com',
      password: 'Password123',
    };

    it('logs in successfully and returns user + token', async () => {
      mockRepository.findUser.mockResolvedValueOnce(fakeUser);
      (authManager.comparePassword as jest.Mock).mockResolvedValueOnce(true);
      (authManager.generateToken as jest.Mock).mockResolvedValueOnce('mocked.jwt.token');

      const result = await authService.loginService(loginInput);

      expect(mockRepository.findUser).toHaveBeenCalledWith(loginInput.email.toLowerCase());
      expect(authManager.comparePassword).toHaveBeenCalledWith(
        loginInput.password,
        fakeUser.password_hash
      );
      expect(authManager.generateToken).toHaveBeenCalledWith(fakeUser.id);

      expect(result).toEqual({
        foundUserResult: fakeUser,
        token: 'mocked.jwt.token',
      });
    });

    it('throws NotFoundException if user not found', async () => {
      mockRepository.findUser.mockResolvedValueOnce(undefined);

      await expect(authService.loginService(loginInput)).rejects.toThrow(NotFoundException);
    });

    it('throws UnauthorizedException if password is wrong', async () => {
      mockRepository.findUser.mockResolvedValueOnce(fakeUser);
      (authManager.comparePassword as jest.Mock).mockResolvedValueOnce(false);

      await expect(authService.loginService(loginInput)).rejects.toThrow(UnauthorizedException);
    });
  });
});
