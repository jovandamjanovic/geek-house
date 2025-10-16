import {UserRepository} from "@/lib/persistence/user/google-spreadsheet/UserRepository";

export const userRepository = new UserRepository(process.env.GOOGLE_SPREADSHEET_ID!);

