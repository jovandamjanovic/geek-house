import {UserRepository} from "@/lib/domain/user-management/repository/UserRepository";
import {User} from "@/types";

export class UserService {
    constructor(
        private userRepository: UserRepository) {
    }

    public async getUserByUsername(username: string): Promise<User | null> {
        return this.userRepository.find(username);
    }


}