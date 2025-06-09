// src/tests/usersServices.test.ts

import UsersServices from '../services/UsersService';
import { IUsersRepository } from '../types/repositories/IUsersRepository';
import { NotFoundException } from '../exceptions/not-found-exception';
import { NormalizedUserInput, Role, UpdateUserDTO, User } from '../types/dataTypes/userData';
import { City } from '../types/dataTypes/cityData';
import { normalizeCityInput, normalizeUserUpdateInput } from '../utils/normalizationUtils';

jest.mock('../utils/normalizationUtils', () => ({
  normalizeCityInput: jest.fn(),
  normalizeUserUpdateInput: jest.fn(),
}));
const mockUsersRepo = {
  listUsers: jest.fn(),
  findUser: jest.fn(),
  updateUser: jest.fn(),
  softDeleteUser: jest.fn(),
  createUser: jest.fn(),
} as jest.Mocked<IUsersRepository>;

const mockCitiesServices = {
  findCity: jest.fn(),
  addCity: jest.fn(),
};
const userService = new UsersServices(mockUsersRepo, mockCitiesServices as any);

describe('UsersServices', () => {
  const fakeUser: User = {
    id: 1,
    email: 'test@example.com',
    password_hash: 'hashed_pw',
    full_name: 'test user',
    role: Role.JOBSEEKER,
    phone: '123',
    city_id: 1,
    birth_date: new Date(),
    created_at: new Date(),
    deleted_at: null,
  };
  const fakeCity: City = {
    id: 99,
    name: 'new york',
    created_at: new Date(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getUsersList', () => {
    it('should return list of users', async () => {
      mockUsersRepo.listUsers.mockResolvedValue([fakeUser]);
      const users = await userService.getUsersList();
      expect(users).toEqual([fakeUser]);
      expect(mockUsersRepo.listUsers).toHaveBeenCalled();
    });
  });

  describe('getUserById', () => {
    it('should return a user by id', async () => {
      mockUsersRepo.findUser.mockResolvedValue(fakeUser);
      const user = await userService.getUserById(1);
      expect(user).toEqual(fakeUser);
    });

    it('should throw NotFoundException if user not found', async () => {
      mockUsersRepo.findUser.mockResolvedValue(null);
      await expect(userService.getUserById(2)).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateUserById', () => {
    const updatedUser: User = {
      ...fakeUser,
      full_name: 'updated',
    };

    it('should update and return the user without city change', async () => {
      const updateData: UpdateUserDTO = { full_name: 'Updated' };
      const normalizedUpdateData: NormalizedUserInput = { full_name: 'updated' };

      (normalizeUserUpdateInput as jest.Mock).mockReturnValue(normalizedUpdateData);
      mockUsersRepo.findUser.mockResolvedValue(fakeUser);
      mockUsersRepo.updateUser.mockResolvedValue(updatedUser);

      const result = await userService.updateUserById(1, updateData);
      expect(normalizeUserUpdateInput).toHaveBeenCalledWith(updateData);
      expect(result).toEqual(updatedUser);
      expect(mockUsersRepo.updateUser).toHaveBeenCalledWith(1, normalizedUpdateData);
    });

    it('should resolve city by name and add if not found', async () => {
      const updateData: UpdateUserDTO = { full_name: 'Updated', city: 'new york' };
      const normalizedUpdateData: NormalizedUserInput = { full_name: 'updated', city_id: 99 };

      (normalizeUserUpdateInput as jest.Mock).mockReturnValue(normalizedUpdateData);

      mockCitiesServices.findCity.mockResolvedValueOnce(null);
      mockCitiesServices.addCity.mockResolvedValueOnce(fakeCity);

      mockUsersRepo.findUser.mockResolvedValue(fakeUser);
      mockUsersRepo.updateUser.mockResolvedValue({ ...updatedUser, city_id: 99 });

      const result = await userService.updateUserById(1, updateData);
      expect(normalizeUserUpdateInput).toHaveBeenCalledWith(updateData);

      expect(mockCitiesServices.findCity).toHaveBeenCalledWith('new york');
      expect(mockCitiesServices.addCity).toHaveBeenCalledWith({ name: 'new york' });
      expect(mockUsersRepo.updateUser).toHaveBeenCalledWith(1, normalizedUpdateData);
      expect(result).toEqual({ ...updatedUser, city_id: 99 });
    });

    it('should resolve city by ID if it exists', async () => {
      const updateData: UpdateUserDTO = { full_name: 'Updated', city: 99 };
      const normalizedUpdateData: NormalizedUserInput = { full_name: 'updated', city_id: 99 };
      (normalizeUserUpdateInput as jest.Mock).mockReturnValue(normalizedUpdateData);

      mockCitiesServices.findCity.mockResolvedValueOnce(fakeCity);
      mockUsersRepo.findUser.mockResolvedValue(fakeUser);
      mockUsersRepo.updateUser.mockResolvedValue({ ...updatedUser, city_id: 99 });

      const result = await userService.updateUserById(1, updateData);
      expect(normalizeUserUpdateInput).toHaveBeenCalledWith(updateData);
      expect(mockCitiesServices.findCity).toHaveBeenCalledWith(99);
      expect(mockUsersRepo.updateUser).toHaveBeenCalledWith(1, normalizedUpdateData);

      expect(result).toEqual({ ...updatedUser, city_id: 99 });
    });

    it('should throw if city is numeric and not found', async () => {
      mockCitiesServices.findCity.mockResolvedValueOnce(null);
      await expect(userService.updateUserById(1, { city: 123 })).rejects.toThrow(NotFoundException);
    });

    it('should throw if user not found before update', async () => {
      mockUsersRepo.findUser.mockResolvedValue(null);
      await expect(userService.updateUserById(2, { full_name: 'fail' })).rejects.toThrow(
        NotFoundException
      );
    });
  });
  describe('deleteLoggedUser', () => {
    it('should call softDeleteUser with loggedUserId', async () => {
      const deletedUser: User = {
        ...fakeUser,
        deleted_at: new Date(),
      };
      mockUsersRepo.softDeleteUser.mockResolvedValue(deletedUser);
      const deleted = await userService.deleteLoggedUser(1);
      expect(deleted).toEqual(deletedUser);
      expect(mockUsersRepo.softDeleteUser).toHaveBeenCalledWith(1);
    });
  });

  describe('deleteUserByIdAdmin', () => {
    const deletedUser: User = {
      ...fakeUser,
      deleted_at: new Date(),
    };
    it('should throw if user not found', async () => {
      mockUsersRepo.findUser.mockResolvedValue(null);
      await expect(userService.deleteUserByIdAdmin(10)).rejects.toThrow(NotFoundException);
    });

    it('should soft delete if user exists', async () => {
      mockUsersRepo.findUser.mockResolvedValue(fakeUser);
      mockUsersRepo.softDeleteUser.mockResolvedValue(deletedUser);
      const result = await userService.deleteUserByIdAdmin(1);
      expect(result).toEqual(deletedUser);
    });
  });
});
