import { User } from '../errorCodes';

declare global {
  namespace Express {
    interface Request {
      user: User;
    }
  }
}
