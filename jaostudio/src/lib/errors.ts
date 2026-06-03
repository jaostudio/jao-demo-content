export type AppErrorCode =
  | 'VALIDATION_ERROR'
  | 'RATE_LIMITED'
  | 'EMAIL_FAILED'
  | 'ANALYTICS_FAILED'
  | 'INVALID_ORIGIN'
  | 'INVALID_JSON'
  | 'INTERNAL_ERROR'

export class AppError extends Error {
  code: AppErrorCode
  status: number
  safeMessage: string
  context?: Record<string, unknown>

  constructor(code: AppErrorCode, status: number, message: string, context?: Record<string, unknown>) {
    super(message)
    this.name = 'AppError'
    this.code = code
    this.status = status
    this.safeMessage = message
    this.context = context
  }

  toJSON() {
    return {
      ok: false,
      error: this.safeMessage,
      code: this.code,
    }
  }

  sentryTags() {
    return { errorCode: this.code, httpStatus: this.status }
  }
}

export function isAppError(err: unknown): err is AppError {
  return err instanceof AppError
}
