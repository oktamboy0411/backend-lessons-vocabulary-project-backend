class HttpException extends Error {
  constructor(status_code, message) {
    super(message);
    this.status_code = status_code;
    this.message = message;
  }
}

module.exports = { HttpException };
