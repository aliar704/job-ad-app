import { ErrorCode } from '../types/errorCodes';
import { HttpException } from './root';

export class ForbiddenException extends HttpException {
  constructor(
    message: string = 'Forbidden',
    errorCode: ErrorCode = ErrorCode.FORBIDDEN_EXCEPTION,
    errors?: any
  ) {
    super(message, 403, errorCode, errors);
  }
}
