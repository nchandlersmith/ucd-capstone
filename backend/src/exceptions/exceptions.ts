export class AuthError extends Error {
  private statusCode: number
  constructor(message: string) {
    super(message)
  this.statusCode = 403
  }
}

export class ModelValidationError extends Error {
  private statusCode: number
  constructor(message: string) {
    super(message)
    this.statusCode = 400
  }
}

export class EntityNotFoundError extends Error {
  private statusCode: number
  constructor(message: string) {
    super(message)
    this.statusCode = 404
  }
}
