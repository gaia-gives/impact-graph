import { Application } from "./../entities/application";
import { MyContext } from "./../types/MyContext";
import { Repository } from "typeorm";
import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { InjectRepository } from "typeorm-typedi-extensions";
import { ApplicationState } from "../entities/application";
import { assertAdminAccess } from "../utils/assertAdminAccess";
import { getUser } from "../utils/getUser"

@Resolver(() => Application)
export class ApplicationAdministrationResolver {
  constructor(
    @InjectRepository(Application)
    private readonly applicationRepository: Repository<Application>,
  ) {}

  @Authorized()
  @Query(() => [Application])
  async applicationsAsAdmin(
    @Ctx() ctx: MyContext,
    @Arg("applicationState", { nullable: true })
    applicationState?: ApplicationState
  ) {
    const user = await getUser(ctx)
    assertAdminAccess(user);

    const query = this.applicationRepository.createQueryBuilder("application");

    if (!applicationState) {
      return await query
        .where("application.applicationState IN (:...applicationStates)", {
          applicationStates: [
            ApplicationState.ACCEPTED,
            ApplicationState.PENDING,
            ApplicationState.REJECTED,
          ],
        })
        .getMany();
    } else {
      return await query
        .where("application.applicationState = :applicationState", {
          applicationState: applicationState,
        })
        .getMany();
    }
  }

  @Authorized()
  @Query(() => Application)
  async applicationAsAdmin(
    @Ctx() ctx: MyContext,
    @Arg("id", { nullable: false }) id: string
  ) {
    const user = await getUser(ctx)
    assertAdminAccess(user);

    return await this.applicationRepository.findOne(id);
  }

  @Authorized()
  @Mutation(() => Application)
  async updateAdminComment(
    @Ctx() ctx: MyContext,
    @Arg("id", { nullable: false }) id: string,
    @Arg("adminComment", { nullable: false }) adminComment: string
  ) {
    const user = await getUser(ctx)
    const application = await this.applicationRepository.findOne({id});

    if (user && application) {
      application?.updateAdminComment(user, adminComment);
      application.save();
    }
    return application;
  }
}
