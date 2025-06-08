import { ErrorCode } from '../types/errorCodes';
import { HttpException } from './root';

export class NotFoundException extends HttpException {
  constructor(message: string, errorCode: ErrorCode = ErrorCode.NOT_FOUND_EXCEPTION, errors?: any) {
    super(message, 404, errorCode, errors);
  }
}
