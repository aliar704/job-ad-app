import { ErrorCode } from '../types/errorCodes';
import { HttpException } from './root';

export class UnauthorizedException extends HttpException {
  constructor(
    message: string,
    errorCode: ErrorCode = ErrorCode.UNAUTHORIZED_EXCEPTION,
    errors?: any
  ) {
    super(message, 401, errorCode, errors);
  }
}
