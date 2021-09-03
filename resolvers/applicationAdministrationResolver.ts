import { Application, ApplicationStep } from "./../entities/application";
import { MyContext } from "./../types/MyContext";
import { Repository } from "typeorm";
import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { InjectRepository } from "typeorm-typedi-extensions";
import { ApplicationState } from "../entities/application";
import { assertAdminAccess } from "../utils/userAccess";
import { getUser } from "../utils/getUser"
import { ERROR_CODES } from "../utils/errorCodes";
import { sendEmail } from "../utils/sendEmail";
import { User } from "../entities/user";
import config from '../config'

const sendMailToApplicant = async (user: User, applicationId: string) => {
  if (!user) {
    throw new Error(ERROR_CODES.INVALID_OPERATION);
  }

  const applicationLink = `${config.get("WEBSITE_URL")}/applications/${applicationId}`;
  return await sendEmail({
    from: config.get("GAIA_EMAIL_FROM"),
    to: user.email!,
    subject: "Your application status",
    html: `We have some updates concerning your application. You can check it here: <a href="${applicationLink}">${applicationLink}</a>`
  });
}

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

    const application = await this.applicationRepository.findOne(id);
    if (application?.readByAdmin !== true) {
      application?.setRead();
      await application?.save();
    }
    return application;
  }

  @Authorized()
  @Mutation(() => Application)
  async approveApplication(
    @Ctx() ctx: MyContext,
    @Arg("id", { nullable: false }) id: string,
    @Arg("adminComment", { nullable: false }) adminComment: string
  ) {
    const user = await getUser(ctx)
    assertAdminAccess(user)
    const application = await this.applicationRepository.findOne({id}, { relations: ["user"] });

    if (user && application) {
      application.updateAdminComment(adminComment);
      application.applicationState = ApplicationState.ACCEPTED;
      
      if(application.applicationStep === ApplicationStep.STEP_1) {
        application.applicationStep = ApplicationStep.STEP_2;
      }
      await application.save();
      await sendMailToApplicant(application.user, application.id);
    }
    return application;
  }

  @Authorized()
  @Mutation(() => Application)
  async declineApplication(
    @Ctx() ctx: MyContext,
    @Arg("id", { nullable: false }) id: string,
    @Arg("adminComment", { nullable: false }) adminComment: string
  ) {
    const user = await getUser(ctx)
    assertAdminAccess(user)
    const application = await this.applicationRepository.findOne({id}, { relations: ["user"] });

    if (user && application) {
      application.updateAdminComment(adminComment);
      application.applicationState = ApplicationState.REJECTED;
      await application.save();
      await sendMailToApplicant(application.user, application.id);
    }

    return application;
  }
}
