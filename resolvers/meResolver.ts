import { createConfirmNewMailUrl } from '../utils/createConfirmNewMailUrl';
import { Resolver, Query, Ctx, Authorized, Mutation, Arg } from "type-graphql";
import { InjectRepository } from "typeorm-typedi-extensions";

import { User } from "../entities/user";
import { Organisation } from "../entities/organisation";
import { Project } from "../entities/project";
import { MyContext } from "../types/MyContext";
import { Repository } from "typeorm";
import { ERROR_CODES } from "../utils/errorCodes";
import * as bcrypt from "bcryptjs";
import { sendEmail } from "../utils/sendEmail";
import config from '../config';
import {Service} from "typedi";

function checkIfUserInRequest(ctx: MyContext) {
  if (!ctx.req.user) {
    throw new Error("Access denied");
  }
}

@Service()
@Resolver()
export class MeResolver {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Organisation)
    private readonly organisationRepository: Repository<Organisation>,

    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project> // @InjectRepository(OrganisationProject) // private readonly organisationProjectRepository: Repository< //   OrganisationProject // >
  ) {}

  async getLoggedInUser(ctx: MyContext) {
    checkIfUserInRequest(ctx);
  
    const user = await this.userRepository
      .createQueryBuilder("user")
      .leftJoinAndSelect("user.organisations", "organisations")
      .where({ id: ctx.req.user.userId })
      .getOne();


    if (!user) {
      const userMessage = "Access denied";
      throw new Error(userMessage);
    }
  
    return user;
  }

  @Authorized()
  @Query(() => User, { nullable: true, complexity: 5 })
  me(@Ctx() ctx: MyContext): Promise<User | undefined> {
    return this.getLoggedInUser(ctx);
  }

  private async assertAuthenticatedAndAuthorized(
    userId: number | undefined,
    password: string
  ): Promise<User | undefined> {
    if (!userId) throw new Error(ERROR_CODES.AUTHENTICATION_REQUIRED);

    const dbUser = await this.userRepository.findOne(
      { id: userId },
      { select: ["id", "password"] }
    );
    const authorizedEdit = await bcrypt.compare(
      password,
      dbUser?.password ?? ""
    );
    if (!authorizedEdit) throw new Error(ERROR_CODES.UNAUTHORIZED);

    return dbUser;
  }

  @Authorized()
  @Mutation(() => Boolean)
  async updateMyEmail(
    @Arg("newEmail", { nullable: false }) newEmail: string,
    @Arg("password", { nullable: false }) password: string,
    @Ctx() { req: { user } }: MyContext
  ) {
    const dbUser = await this.assertAuthenticatedAndAuthorized(
      user?.userId,
      password
    );
    if (dbUser) {
      await User.update(dbUser, { newEmail: newEmail });
      const confirmationUrl = await createConfirmNewMailUrl(dbUser.id);
      await sendEmail({
        to: newEmail,
        from: config.get("GAIA_EMAIL_FROM"),
        subject: "Gaia Gives - New email address confirmation link",
        html: `Confirm your new email address: <a href="${confirmationUrl}">${confirmationUrl}</a>`
      });
      return true;
    } else {
      return false;
    }
  }

  @Authorized()
  @Mutation(() => Boolean)
  async updateMyPassword(
    @Arg("newPassword", { nullable: false }) newPassword: string,
    @Arg("password", { nullable: false }) password: string,
    @Ctx() { req: { user } }: MyContext
  ) {
    const dbUser = await this.assertAuthenticatedAndAuthorized(
      user?.userId,
      password
    );
    const newHashedPassword = bcrypt.hashSync(newPassword, 12);
    if (dbUser) {
      await User.update(dbUser, { password: newHashedPassword });
      return true;
    } else {
      return false;
    }
  }

  @Authorized()
  @Mutation(() => Boolean)
  async updateMyFirstNameAndLastName(
    @Arg("firstName", { nullable: false }) firstName: string,
    @Arg("lastName", { nullable: false }) lastName: string,
    @Ctx() { req: { user } }: MyContext
  ) {
    const dbUser = await this.userRepository.findOne({ id: user.userId });
    if (dbUser) {
      dbUser.firstName = firstName;
      dbUser.lastName = lastName;
      await dbUser.save()
      return true;
    } else {
      return false;
    }
  }
}
