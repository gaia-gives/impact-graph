import {ERROR_CODES} from "../utils/errorCodes";
import {User} from "../entities/user";
import {Arg, Args, Authorized, Ctx, Field, Mutation, ObjectType, Query, Resolver,} from "type-graphql";
import uuid from "uuid";
import {FileUpload, GraphQLUpload} from "graphql-upload";
import {Repository} from "typeorm";
import {InjectRepository} from "typeorm-typedi-extensions";
import {Application, ApplicationState, ApplicationStep,} from "../entities/application";
import {MyContext} from "../types/MyContext";
import {saveFile} from "../utils/saveFile";
import {getUser} from "../utils/getUser";
import {getFileSize} from "../utils/getFileSize";
import {
  ApplicationStepOneDraftVariables,
  ApplicationStepOneSubmitVariables,
  ApplicationStepTwoDraftVariables,
  ApplicationStepTwoSubmitVariables,
  File,
} from "./types/application";
import {ResolverResult} from "./types/ResolverResult";
import {isAdmin} from "../utils/userAccess";
import {cleanUpApplicationFiles} from "../utils/cleanUpApplicationFiles";
import {Service} from "typedi";

@ObjectType()
export class ApplicationQueryResult extends ResolverResult {
  @Field(() => Application, { nullable: true })
  result?: Application;
}

@ObjectType()
export class ApplicationDocumentUploadResult extends ResolverResult {
  @Field(() => Application)
  application: Application;
  @Field(() => [File!], { nullable: true })
  files?: File[];
}

@Service()
@Resolver(() => Application)
export class ApplicationResolver {
  constructor(
    @InjectRepository(Application)
    private readonly applicationRepository: Repository<Application>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  @Authorized()
  @Query(() => ApplicationQueryResult)
  async application(
    @Ctx() ctx: MyContext,
    @Arg("id", { nullable: false }) id: string
  ) {
    const userId = ctx.req.user?.userId;
    const result = new ApplicationQueryResult();
    const user = await this.userRepository.findOne({ where: { id: userId } });
    const application = await this.applicationRepository.findOne({
      where: isAdmin(user) ? { id } : { id, userId },
      relations: ["user"],
    });

    if (application) {
      result.result = application;
    } else {
      result.addProblem({
        code: "UNKNOWN_ID",
        message: "No application found for given user and id",
      });
    }

    return result;
  }

  @Authorized()
  @Query(() => ApplicationQueryResult)
  async activeApplication(@Ctx() ctx: MyContext) {
    const user = await getUser(ctx);
    const result = new ApplicationQueryResult();
    if (user) {
      result.result = await this.applicationRepository
          .createQueryBuilder("application")
          .where("application.applicationState IN (:...applicationStates)", {
            applicationStates: [ApplicationState.INITIAL, ApplicationState.DRAFT, ApplicationState.PENDING],
          })
          .andWhere("application.userId = :userId", {userId: user.id})
          .getOne();
    }
    return result;
  }

  @Authorized()
  @Mutation(() => ApplicationQueryResult)
  async createApplication(
    @Arg("legalName", { nullable: false }) legalName: string,
    @Ctx() ctx: MyContext
  ) {
    const result = new ApplicationQueryResult();
    const userId = ctx.req.user.userId;

    const { result: activeApplication } = await this.activeApplication(ctx);

    if (activeApplication) {
      result.addProblem({
        code: "MALFORMED_INPUT",
        message: "There already exists an active application.",
      });
    } else {
      const application = this.applicationRepository.create({
        legalName,
        userId,
      });
      result.result = await application.save();
    }

    return result;
  }

  @Authorized()
  @Mutation(() => ApplicationQueryResult)
  async updateApplicationStepOneDraft(
    @Args() applicationStepOneDraft: ApplicationStepOneDraftVariables,
    @Ctx() ctx: MyContext
  ) {
    const result = new ApplicationQueryResult();
    const user = await this.userRepository.findOne(ctx.req.user.userId);
    if (!user) {
      throw new Error(ERROR_CODES.AUTHENTICATION_REQUIRED);
    }
    const application = await this.applicationRepository.findOne(
      { id: applicationStepOneDraft.id, userId: user.id }
    );

    if (!application) {
      result.addProblem({
        code: "UNKNOWN_ID",
        message: "No application found for given id!",
      });
    } else {
      application.assertCanUpdate(ApplicationStep.STEP_1);
      application.applicationState = ApplicationState.DRAFT;
      Application.merge(application, applicationStepOneDraft);
      result.result = await application.save();
    }
    return result;
  }

  @Authorized()
  @Mutation(() => ApplicationQueryResult)
  async updateApplicationStepTwoDraft(
    @Args() applicationStepTwoDraft: ApplicationStepTwoDraftVariables,
    @Ctx() ctx: MyContext
  ) {
    const result = new ApplicationQueryResult();
    const userId = ctx.req.user.userId;
    const user = await this.userRepository.findOne(userId);
    if (!user) {
      throw new Error(ERROR_CODES.AUTHENTICATION_REQUIRED);
    }

    const application = await this.applicationRepository.findOne(
      {
        id: applicationStepTwoDraft.id,
        user: user,
      },
      { relations: ["user"] }
    );
    if (!application) {
      result.addProblem({
        code: "UNKNOWN_ID",
        message: "No application found for given id!",
      });
    } else {
      application.assertCanUpdate(ApplicationStep.STEP_2);
      application.applicationState = ApplicationState.DRAFT;
      Application.merge(application, {
        ...applicationStepTwoDraft,
        applicationStep: ApplicationStep.STEP_2,
      });
      result.result = await application.save();
      await cleanUpApplicationFiles(application, userId);
    }
    return result;
  }

  @Authorized()
  @Mutation(() => ApplicationQueryResult, {
    description: "For updating the draft of the first step of the application",
  })
  async submitApplicationStepOne(
    @Args() applicationStepOneSubmit: ApplicationStepOneSubmitVariables,
    @Ctx() ctx: MyContext
  ) {
    const result = new ApplicationQueryResult();
    const application = await this.applicationRepository.findOne({
      id: applicationStepOneSubmit.id,
      userId: ctx.req.user.userId,
    });
    if (!application) {
      result.addProblem({
        code: "UNKNOWN_ID",
        message: "No application found for given id!",
      });
    } else {
      application.assertCanSubmit(ApplicationStep.STEP_1);
      Application.merge(application, {
        ...applicationStepOneSubmit,
        applicationState: ApplicationState.PENDING,
      });
      result.result = await application.save();
    }
    return result;
  }

  @Authorized()
  @Mutation(() => ApplicationQueryResult, {
    description: "For updating the draft of the second step of the application",
  })
  async submitApplicationStepTwo(
    @Args() applicationStepTwoSubmit: ApplicationStepTwoSubmitVariables,
    @Ctx() ctx: MyContext
  ) {
    const result = new ApplicationQueryResult();
    const userId = ctx.req.user.userId;
    const application = await this.applicationRepository.findOne(
      { id: applicationStepTwoSubmit.id, userId },
      { relations: ["user"] }
    );
    if (!application) {
      result.addProblem({
        code: "UNKNOWN_ID",
        message: "The application with the given was not found!",
      });
    } else {
      application.assertCanSubmit(ApplicationStep.STEP_2);
      Application.merge(application, {
        ...applicationStepTwoSubmit,
        applicationState: ApplicationState.PENDING,
      });
      result.result = await application.save();
      await cleanUpApplicationFiles(application, userId);
    }
    return result;
  }

  @Authorized()
  @Mutation(() => ApplicationDocumentUploadResult)
  async uploadApplicationDocument(
    @Arg("documents", () => [GraphQLUpload]) documents: FileUpload[],
    @Arg("applicationId", () => String) applicationId: string,
    @Ctx() ctx: MyContext
  ) {
    const result = new ApplicationDocumentUploadResult();
    const userId = ctx.req.user.userId;
    const user = await this.userRepository.findOne(userId);

    if (!user) {
      throw new Error(ERROR_CODES.AUTHENTICATION_REQUIRED);
    } else {
      const files = await Promise.all(
        documents.map(async (document) => {
          const id = uuid.v4();
          const {
            createReadStream,
            filename: name,
            mimetype: type,
          } = await document;
          await saveFile(applicationId, userId, id, createReadStream);
          const size = await getFileSize(applicationId, userId, id);
          return {
            id,
            name,
            type,
            size,
          };
        })
      );
      result.files = files;
    }

    return result;
  }
}
