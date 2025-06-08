import { JWT_SECRET } from '../secrets';
import * as jwt from 'jsonwebtoken';
import { compare, hash } from 'bcrypt';

class AuthManager {
  constructor() {}

  async generateToken(userID: number): Promise<string> {
    return jwt.sign({ userId: userID }, JWT_SECRET);
  }
  async hashPassword(password: string): Promise<string> {
    return await hash(password, 10);
  }

  async comparePassword(plain: string, hashed: string): Promise<boolean> {
    return await compare(plain, hashed);
  }
}

export default new AuthManager();
