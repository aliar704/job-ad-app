import { NormalizedUserInput, User } from '../dataTypes/userData';

export interface IUsersRepository {
  findUser(input: string | number): Promise<User | null>;
  createUser(data: NormalizedUserInput): Promise<User>;
  listUsers(): Promise<User[]>;
  updateUser(loggedUserId: number, data: NormalizedUserInput): Promise<User>;
  softDeleteUser(loggedUserId: number): Promise<User>;
}
