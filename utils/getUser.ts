import { User } from "../entities/user";
import { MyContext } from "../types/MyContext";
import { getRepository } from "typeorm";

export const getUser = async (ctx: MyContext) => {
    const userRepository = getRepository(User)
    const userId = ctx.req.user?.userId
    return await userRepository.findOne({ id: userId})
}