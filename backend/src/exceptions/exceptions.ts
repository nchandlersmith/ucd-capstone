export class AuthError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export class ModelValidationError extends Error {
  constructor(message: string) {
    super(message);
  }
}
