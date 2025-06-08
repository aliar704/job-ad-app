import { ErrorCode } from '../types/errorCodes';

export class HttpException extends Error {
  message: string;
  errorCode: ErrorCode;
  statusCode: number;
  errors?: any;

  constructor(message: string, statusCode: number, errorCode: ErrorCode, errors?: any) {
    super(message);
    this.message = message;
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.errors = errors;
  }
}
