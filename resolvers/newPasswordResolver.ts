import { Arg, Field, Mutation, ObjectType, Resolver } from "type-graphql";
import { Repository } from "typeorm";
import { InjectRepository } from "typeorm-typedi-extensions";
import { v4 } from "uuid";
import * as bcrypt from "bcryptjs";

import { forgotPasswordPrefix } from "../constants/redisPrefixes";
import { User } from "../entities/user";
import { redis } from "../redis";
import { sendEmail } from "../utils/sendEmail";
import { createSetNewPasswordUrl } from "../utils/createSetNewPasswordUrl";
import { ApolloError } from "apollo-server-express";
import config from "../config";
import {Service} from "typedi";

@ObjectType()
export class SendPasswordResetLinkResponse {
  @Field()
  public readonly email: string;

  constructor(email: string) {
    this.email = email;
  }
}

@ObjectType()
export class SetNewPasswordResponse {
  @Field()
  public readonly token: string;

  constructor(token: string) {
    this.token = token;
  }
}

enum SetNewPasswordErrorType {
  INVALID_TOKEN,
  INVALID_EMAIL
} 

class SetNewPasswordError extends ApolloError {
  constructor(message: string, public readonly errorType: SetNewPasswordErrorType) {
    super(message)
   }
}

@Service()
@Resolver()
export class NewPasswordResolver {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>
  ) {}

  @Mutation(() => SendPasswordResetLinkResponse, { nullable: true })
  public async sendPasswordResetLink(@Arg("email") email: string) {
    const key = `${forgotPasswordPrefix}${email}`;
    const token = v4();
    const body = createSetNewPasswordUrl(email, token);
    await redis.set(key, token, "EX", config.get("PASSWORD_RESET_TOKEN_LIFETIME_SECONDS"));
    const user = await this.userRepository.findOne({ email });
    if (user) {
      await sendEmail({
        to: email,
        from: config.get("GAIA_EMAIL_FROM"),
        subject: "Gaia Gives - Password reset",
        html: body
      });
    }
    return new SendPasswordResetLinkResponse(email);
  }

  @Mutation(() => SetNewPasswordResponse, { nullable: false })
  public async setNewPassword(
    @Arg("email") email: string,
    @Arg("password") password: string,
    @Arg("token") token: string
  ) {
    const key = `${forgotPasswordPrefix}${email}`;
    if (token !== (await redis.get(key))) {
      throw new SetNewPasswordError("The provided token does not exist or is expired.", SetNewPasswordErrorType.INVALID_TOKEN);
    }
    await redis.del(key);
    const user = await this.userRepository.findOne({ email });
    if (!user) {
      throw new SetNewPasswordError("The provided email address does not exist.", SetNewPasswordErrorType.INVALID_EMAIL);
    }
    const hashedPassword = bcrypt.hashSync(password, 12);
    user.password = hashedPassword;
    await user.save();
    return new SetNewPasswordResponse(token);
  }
}
