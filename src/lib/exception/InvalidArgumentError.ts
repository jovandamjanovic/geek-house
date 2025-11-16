import CustomError from "@/lib/exception/CustomError";

export default class InvalidArgumentError extends CustomError {
  constructor(message: string) {
    super(message, 400);
  }
}
