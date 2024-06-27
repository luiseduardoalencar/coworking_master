export class UserAlreadyExistsError extends Error {
  statusCode: number;

  constructor({ message, statusCode }: { message: string; statusCode: number }) {
    super(message);
    this.name = message;
    this.statusCode = statusCode;
  }
}