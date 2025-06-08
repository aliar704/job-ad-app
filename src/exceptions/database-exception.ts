import { ErrorCode } from '../types/errorCodes';
import { HttpException } from './root';

export class DatabaseException extends HttpException {
  constructor(
    message: string,
    errorCode: ErrorCode = ErrorCode.INTERNAL_DATABASE_EXCEPTION,
    errors?: any
  ) {
    super(message, 500, errorCode, errors);
  }
}
