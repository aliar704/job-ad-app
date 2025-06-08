import { ErrorCode } from '../types/errorCodes';
import { HttpException } from './root';

export class InternalException extends HttpException {
  constructor(message: string, errorCode: ErrorCode = ErrorCode.INTERNAL_EXCEPTION, errors?: any) {
    super(message, 500, errorCode, errors);
  }
}
