import { ErrorCode } from '../types/errorCodes';
import { HttpException } from './root';

export class UnprocessableEntity extends HttpException {
  constructor(
    message: string,
    errorCode: ErrorCode = ErrorCode.UNPROCESSABLE_ENTITY_EXCEPTION,
    errors?: any
  ) {
    super(message, 422, errorCode, errors);
  }
}
