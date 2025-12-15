import { User } from "@/types";

export class AuthService {
  public verifyUser(user: User, password: string) {
    return user.password === password;
  }
}
