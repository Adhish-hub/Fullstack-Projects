export class ApiError extends Error {
  status?: number;
  details?: string[];

  constructor(message: string, status?: number, details?: string[]) {
    super(message);

    this.name = "ApiError";
    this.status = status;
    this.details = details;

    Object.setPrototypeOf(this, ApiError.prototype);
  }
}
