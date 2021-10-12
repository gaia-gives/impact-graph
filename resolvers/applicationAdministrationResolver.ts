import { Organisation } from "./../entities/organisation";
import { Application, ApplicationStep } from "../entities/application";
import { MyContext } from "../types/MyContext";
import { Repository } from "typeorm";
import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { InjectRepository } from "typeorm-typedi-extensions";
import { ApplicationState } from "../entities/application";
import { assertAdminAccess } from "../utils/userAccess";
import { getUser } from "../utils/getUser";
import { ERROR_CODES } from "../utils/errorCodes";
import { sendEmail } from "../utils/sendEmail";
import { User } from "../entities/user";
import config from "../config";
import { Service } from "typedi";

const sendMailToApplicant = async (
  user: User,
  applicationId: string,
  step: ApplicationStep,
  state: ApplicationState
) => {
  if (!user) {
    throw new Error(ERROR_CODES.INVALID_OPERATION);
  }

  const approvedInStep2 =
    step === ApplicationStep.STEP_2 && state === ApplicationState.ACCEPTED;
  const applicationLink = `${config.get(
    "WEBSITE_URL"
  )}/applications/${applicationId}`;

  const subject = approvedInStep2
    ? "Your organisation was created!"
    : "Your application status";
  const html = approvedInStep2
    ? "Congratulations! Your organisation was created right after we approved your application. Login with your user and check out your user profile to access your newly created organisation."
    : `We have some updates concerning your application. You can check it here: <a href="${applicationLink}">${applicationLink}</a>`;

  return await sendEmail({
    from: config.get("GAIA_EMAIL_FROM"),
    to: user.email!,
    subject: subject,
    html: html,
  });
};

@Service()
@Resolver(() => Application)
export class ApplicationAdministrationResolver {
  constructor(
    @InjectRepository(Application)
    private readonly applicationRepository: Repository<Application>,
    @InjectRepository(Organisation)
    private readonly organisationRepository: Repository<Organisation>
  ) {}

  @Authorized()
  @Query(() => [Application])
  async applicationsAsAdmin(
    @Ctx() ctx: MyContext,
    @Arg("applicationState", { nullable: true })
    applicationState?: ApplicationState
  ) {
    const user = await getUser(ctx);
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
    const user = await getUser(ctx);
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
    const user = await getUser(ctx);
    assertAdminAccess(user);
    const application = await this.applicationRepository.findOne(
      { id },
      { relations: ["user"] }
    );

    if (user && application) {
      application.updateAdminComment(adminComment);
      application.applicationState = ApplicationState.ACCEPTED;

      if (application.applicationStep === ApplicationStep.STEP_1) {
        application.applicationState = ApplicationState.INITIAL;
        application.applicationStep = ApplicationStep.STEP_2;
      } else {
        const organisation = application.createOrganisationThroughApproval();
        const createdOrganisaton =
          this.organisationRepository.create(organisation);
        const orga = await createdOrganisaton.save();
      }
      await application.save();
      await sendMailToApplicant(
        application.user,
        application.id,
        application.applicationStep,
        application.applicationState
      );
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
    const user = await getUser(ctx);
    assertAdminAccess(user);
    const application = await this.applicationRepository.findOne(
      { id },
      { relations: ["user"] }
    );

    if (user && application) {
      application.updateAdminComment(adminComment);
      application.applicationState = ApplicationState.REJECTED;
      await application.save();
      await sendMailToApplicant(
        application.user,
        application.id,
        application.applicationStep,
        application.applicationState
      );
    }

    return application;
  }
}
