// 404
export class NotFoundError extends Error {
  constructor(message = "Resource not found") {
    super(message);
    this.name = "NotFoundError";
  }
}
// 401
export class Unauthorized extends Error {
  constructor(message = "Unauthorized to view this resource") {
    super(message);
    this.name = "Unauthorized";
  }
}
//403
export class Forbidden extends Error {
  constructor(message = "Forbidden") {
    super(message);
    this.name = "Forbidden";
  }
}
//400
export class BadRequest extends Error {
  constructor(message = "Bad Request or Invalid JSON") {
    super(message);
    this.name = "BadRequest";
  }
}
