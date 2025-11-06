export class ValidationError extends Error {
  constructor(errors) {
    super('Validation Error');
    this.name = 'ValidationError';
    this.errors = errors;
  }
}

export class NotFoundError extends Error {
  constructor(message = 'Resource not found') {
    super(message);
    this.name = 'NotFoundError';
  }
}

export class AuthorizationError extends Error {
  constructor(message = 'Not authorized') {
    super(message);
    this.name = 'AuthorizationError';
  }
}