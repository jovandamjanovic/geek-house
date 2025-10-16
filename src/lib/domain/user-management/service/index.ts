import {UserService} from "@/lib/domain/user-management/service/UserService";
import {AuthService} from "@/lib/domain/user-management/service/AuthService";
import {userRepository} from "@/lib/domain/user-management/repository";

export const userService = new UserService(userRepository);
export const authService = new AuthService();