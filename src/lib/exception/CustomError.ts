export default class CustomError extends Error {
  public readonly message: string;

  constructor(
    message: string,
    public readonly status: string,
  ) {
    super(message);
    this.message = message;
  }
}
