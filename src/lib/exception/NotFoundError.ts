import CustomError from "@/lib/exception/CustomError";

export default class NotFoundError extends CustomError {
  constructor(message: string) {
    super(message, 404);
  }
}
