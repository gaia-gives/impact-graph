// tslint:disable-next-line:no-var-requires
import {Service} from "typedi";

require("dotenv").config();
import * as bcrypt from "bcryptjs";
import { Arg, Ctx, Mutation, Resolver } from "type-graphql";
import { User } from "../entities/user";
import { MyContext } from "../types/MyContext";
import * as jwt from "jsonwebtoken";
import { registerEnumType, Field, ObjectType } from "type-graphql";
import config from "../config";
import { ApolloError } from "apollo-server-express";

@ObjectType()
class LoginResponse {
  @Field({ nullable: false })
  user: User;
}

enum LoginErrorType {
  UsernamePasswordCombinationWrong = "USERNAME_PASSWORD_COMBINATION_WRONG",
  ConfirmationError = "CONFIRMATION_ERROR",
}

class LoginError extends ApolloError {
  constructor(message: string, public readonly errorType: LoginErrorType) {
    super(message);
  }
}

enum LoginType {
  Password = "password",
  SignedMessage = "message",
}

registerEnumType(LoginType, {
  name: "Direction", // this one is mandatory
  description: "Is the login request with a password or a signed message", // this one is optional
});

@Service()
@Resolver()
export class LoginResolver {
  @Mutation(() => Boolean)
  async logout(@Ctx() ctx: MyContext): Promise<boolean> {
    ctx.res.clearCookie("token");
    ctx.res.clearCookie("isAuthorized");
    return true;
  }

  @Mutation(() => LoginResponse, { nullable: true })
  async login(
    @Arg("email") email: string,
    @Arg("password") password: string,
    @Arg("loginType", { nullable: true }) loginType: LoginType,
    @Ctx() ctx: MyContext
  ): Promise<LoginResponse> {
    console.log({email, password})
    if (typeof loginType === "undefined") {
      loginType = LoginType.Password;
    }
    switch (loginType) {
      case LoginType.SignedMessage:
        console.log("MESSAGE");
        loginType = LoginType.SignedMessage;
        break;
      case LoginType.Password:
        loginType = LoginType.Password;
        break;
      default:
        throw Error("Invalid login type");
    }

    const user: any = await User.createQueryBuilder("user")
      .where("user.email = :email", { email })
      .andWhere("user.loginType = :loginType", { loginType: "password" })
      .addSelect("user.password")
      .getOne();

    const valid = user && (await bcrypt.compare(password, user.password));

    if (!valid) {
      throw new LoginError(
        "The provided username and password combination does not exist.",
        LoginErrorType.UsernamePasswordCombinationWrong
      );
    }

    if (!user.confirmed) {
      throw new LoginError(
        "The user is not confirmed",
        LoginErrorType.ConfirmationError
      );
    }

    // Not using sessions anymore - ctx.req.session!.userId = user.id
    const accessTokenLifetimeInSeconds = config.get("ACCESS_TOKEN_LIFETIME_IN_DAYS") * 24 * 3600;
    const accessTokenLifetimeInMilliSeconds =
      accessTokenLifetimeInSeconds * 1000;
    const accessToken = jwt.sign(
      { userId: user.id, firstName: user.firstName },
    config.get("JWT_SECRET"),
      { expiresIn: accessTokenLifetimeInSeconds }
    );

    const response = new LoginResponse();

    ctx.res.cookie("token", accessToken, {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production",
      secure: config.get("COOKIE_SECURE") === "true",
      maxAge: accessTokenLifetimeInMilliSeconds,
      signed: true,
    });

    ctx.res.cookie("isAuthorized", true, {
      httpOnly: false,
      sameSite: process.env.NODE_ENV === "production",
      secure: config.get("COOKIE_SECURE") === "true",
      maxAge: accessTokenLifetimeInMilliSeconds,
      signed: false,
    });

    delete user.password;
    response.user = user;
    return response;
  }

  createToken(user: any) {
    return jwt.sign(user, config.get("JWT_SECRET"), {
      expiresIn: "30d",
    });
  }

}
