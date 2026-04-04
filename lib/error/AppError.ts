export class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public data?: unknown
  ) {
    super(message)
    this.name = 'AppError'
    Object.setPrototypeOf(this, AppError.prototype)
  }

  isValidationError(): boolean {
    return this.statusCode === 422 || this.statusCode === 400
  }

  isNotFoundError(): boolean {
    return this.statusCode === 404
  }

  isUnauthorizedError(): boolean {
    return this.statusCode === 401
  }

  isForbiddenError(): boolean {
    return this.statusCode === 403
  }

  isServerError(): boolean {
    return this.statusCode >= 500
  }

  getValidationErrors(): Record<string, string[]> {
    if (this.isValidationError() && typeof this.data === 'object' && this.data !== null) {
      const dataObj = this.data as { errors?: Record<string, string[]> }
      return dataObj.errors || {}
    }
    return {}
  }
}
