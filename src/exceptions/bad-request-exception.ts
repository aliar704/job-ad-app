import { ErrorCode } from '../types/errorCodes';
import { HttpException } from './root';

export class BadRequestException extends HttpException {
  constructor(
    message: string,
    errorCode: ErrorCode = ErrorCode.BAD_REQUEST_EXCEPTION,
    errors?: any
  ) {
    super(message, 400, errorCode, errors);
  }
}
