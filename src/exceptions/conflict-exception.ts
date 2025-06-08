import { HttpException } from './root';
import { ErrorCode } from '../types/errorCodes';

export class ConflictException extends HttpException {
  constructor(
    message: string = 'Conflict',
    errorCode: ErrorCode = ErrorCode.CONFLICT_EXCEPTION,
    errors?: any
  ) {
    super(message, 409, errorCode, errors);
  }
}
