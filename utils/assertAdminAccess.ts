import { GlobalRole, User } from "../entities/user";
import { ERROR_CODES } from "./errorCodes";

export const assertAdminAccess = (user: User) => {
    if (user.globalRole !== GlobalRole.ADMIN) {
        throw new Error(ERROR_CODES.UNAUTHORIZED);
    }
}