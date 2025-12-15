export default abstract class CustomError extends Error {
  public readonly message: string;

  protected constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.message = message;
  }
}
