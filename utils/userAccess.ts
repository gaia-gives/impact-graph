import { GlobalRole, User } from "../entities/user";
import { ERROR_CODES } from "./errorCodes";
import { MyContext } from "../types/MyContext";
import { getRepository } from "typeorm";

export const assertAdminAccess = (user: User | undefined) => {
  if (!isAdmin(user)) {
    throw new Error(ERROR_CODES.UNAUTHORIZED);
  }
};

export const isAdmin = (user: User | undefined) => {
  return user && user.globalRole === GlobalRole.ADMIN;
};

export const getLoggedInUser = async (ctx: MyContext) => {
  assertLoggedIn(ctx);
  const userRepository = getRepository(User);
  const userId = ctx.req.user?.userId;
  const user = await userRepository.findOne({ id: userId });
  if (!user) {
    throw new Error(ERROR_CODES.AUTHENTICATION_REQUIRED);
  }
  return user;
};

const assertLoggedIn = (ctx: MyContext) => {
  const userId = ctx.req.user?.userId;
  if (!userId) {
    throw new Error(ERROR_CODES.AUTHENTICATION_REQUIRED);
  }
};
