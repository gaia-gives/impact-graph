import { Resolver, Query, Ctx, Authorized, Mutation, Arg } from "type-graphql";
import { InjectRepository } from "typeorm-typedi-extensions";

import { User } from "../entities/user";
import { Organisation } from "../entities/organisation";
import { Project } from "../entities/project";
import { OrganisationUser } from "../entities/organisationUser";
import { MyContext } from "../types/MyContext";
import { Repository } from "typeorm";
import Logger from "../logger";
import { ERROR_CODES } from "../utils/errorCodes";
import * as bcrypt from "bcryptjs";
import { getAnalytics } from "../analytics";

const analytics = getAnalytics();

function checkIfUserInRequest(ctx: MyContext) {
  if (!ctx.req.user) {
    throw new Error("Access denied");
  }
}

async function getLoggedInUser(ctx: MyContext) {
  checkIfUserInRequest(ctx);

  const user = await User.findOne({ id: ctx.req.user.userId });

  if (!user) {
    const errorMessage = `No user with userId ${ctx.req.user.userId} found. This userId comes from the token. Please check the pm2 logs for the token. Search for 'Non-existant userToken' to see the token`;
    const userMessage = "Access denied";
    Logger.captureMessage(errorMessage);
    console.error(
      `Non-existant userToken for userId ${ctx.req.user.userId}. Token is ${ctx.req.user.token}`
    );
    throw new Error(userMessage);
  }

  return user;
}

@Resolver()
export class MeResolver {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(OrganisationUser)
    private readonly organisationUserRepository: Repository<OrganisationUser>,

    @InjectRepository(Organisation)
    private readonly organisationRepository: Repository<Organisation>,

    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project> // @InjectRepository(OrganisationProject) // private readonly organisationProjectRepository: Repository< //   OrganisationProject // >
  ) {}

  @Authorized()
  @Query(() => User, { nullable: true, complexity: 5 })
  async me(@Ctx() ctx: MyContext): Promise<User | undefined> {
    const user = await getLoggedInUser(ctx);
    return user;
  }

  private async assertAuthenticatedAndAuthorized(
    userId: number | undefined,
    password: string
  ): Promise<User | undefined> {
    if (!userId) throw new Error(ERROR_CODES.AUTHENTICATION_REQUIRED);

    const dbUser = await this.userRepository.findOne(
      { id: userId },
      { select: ["password"] }
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
      User.update(dbUser, { email: newEmail });
      analytics.identifyUser(dbUser);
      analytics.track("Updated email", dbUser.segmentUserId(), newEmail, null);
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
      User.update(dbUser, { password: newHashedPassword });
      analytics.identifyUser(dbUser);
      analytics.track(
        "Updated password",
        dbUser.segmentUserId(),
        newHashedPassword,
        null
      );
      return true;
    } else {
      return false;
    }
  }

  @Authorized()
  @Mutation(() => Boolean)
  async updateMyFirstNameAndLastName(
    @Arg("newFirstName", { nullable: false }) newFirstName: string,
    @Arg("newLastName", { nullable: false }) newLastName: string,
    @Arg("password", { nullable: false }) password: string,
    @Ctx() { req: { user } }: MyContext
  ) {
    const dbUser = await this.assertAuthenticatedAndAuthorized(
      user?.userId,
      password
    );
    if (dbUser) {
      User.update(dbUser, { firstName: newFirstName, lastName: newLastName });
      analytics.identifyUser(dbUser);
      analytics.track(
        "Updated password",
        dbUser.segmentUserId(),
        { newFirstName, newLastName },
        null
      );
      return true;
    } else {
      return false;
    }
  }

  // @Query(() => [Organisation], { nullable: true, complexity: 5 })
  // async myOrganisations (
  //   @Ctx() ctx: MyContext
  // ): Promise<[Organisation] | undefined> {
  //   const userId = await User.findOne(ctx.req.user.x)

  //   const organisationUsers = await this.organisationUserRepository.find({
  //     cache: 1000,
  //     where: { userId: userId }
  //   })

  //   const organisationUserIds = organisationUsers.map(o => o.id)

  //   return undefined
  //   // return await this.organisationRepository.find({
  //   //   cache: 1000,
  //   //   where: { organisationUserId: In(organisationUserIds) }
  //   // })
  // }

  // @Authorized()
  @Query(() => [Project], { nullable: true, complexity: 5 })
  async myProjects(@Ctx() ctx: MyContext): Promise<Project[] | undefined> {
    const user = await getLoggedInUser(ctx);

    const projects = this.projectRepository.find({
      where: { admin: user.id },
      relations: ["status", "donations", "reactions"],
      order: {
        qualityScore: "DESC",
      },
    });

    return projects;
  }
}
