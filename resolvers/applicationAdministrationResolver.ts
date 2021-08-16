import { GlobalRole, User } from "./../entities/user";
import { MyContext } from "./../types/MyContext";
import { FindManyOptions, Repository } from "typeorm";
import { Arg, Authorized, Ctx, Query, Resolver } from "type-graphql";
import { InjectRepository } from "typeorm-typedi-extensions";
import { Application, ApplicationState } from "../entities/application";
import { ERROR_CODES } from "../utils/errorCodes";

@Resolver(() => Application)
export class ApplicationAdministrationResolver {
  constructor(
    @InjectRepository(Application)
    private readonly applicationRepository: Repository<Application>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  @Authorized()
  @Query(() => [Application])
  async applicationsAsAdmin(
    @Ctx() ctx: MyContext,
    @Arg("applicationState", { nullable: true })
    applicationState?: ApplicationState
  ) {
    const userId = ctx.req.user?.userId;
    const user = await this.userRepository.findOne({ id: userId });
    if (user?.globalRole !== GlobalRole.ADMIN) {
      throw new Error(ERROR_CODES.UNAUTHORIZED);
    }

    const options: FindManyOptions<Application> = {};

    if (applicationState) {
      options.where = { applicationState: applicationState };
    }
    return await this.applicationRepository.find(options);
  }
}
