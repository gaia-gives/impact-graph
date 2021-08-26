import { ERROR_CODES } from "../utils/errorCodes";
import {
  ApplicationStepTwoDraft,
  ApplicationStepTwoDraftVariables,
} from "./types/application/application-step-two-draft";
import { FileReference } from "../entities/fileReference";
import { ResolverResult } from "./types/ResolverResult";
import { User } from "../entities/user";
import {
  Resolver,
  Query,
  Arg,
  Mutation,
  Args,
  Ctx,
  Authorized,
  ID,
  ObjectType,
  Field, ArgsType, Int,
} from "type-graphql";
import { GraphQLUpload, FileUpload } from "graphql-upload";
import { Repository } from "typeorm";
import { InjectRepository } from "typeorm-typedi-extensions";
import {
  Application,
  ApplicationState,
  ApplicationStep,
} from "../entities/application";
import { Category } from "../entities/category";
import { MyContext } from "../types/MyContext";
import { ApplicationStepOneDraft } from "./types/application/application-step-one-draft";
import { defaultTo, update } from "ramda";
import { ApplicationStepOneSubmit } from "./types/application/application-step-one-submit";
import { saveFile } from "../utils/saveFile";
import { deleteFile } from "../utils/deleteFile";
import { isAdmin, getLoggedInUser} from "../utils/userAccess";
import {Service} from "typedi";
import {Max, Min} from "class-validator";

@ObjectType()
export class ApplicationDocumentUploadResult extends ResolverResult {
  @Field(() => Application)
  application: Application;
  @Field(() => [FileReference!], { nullable: true })
  savedFiles?: FileReference[];
}

@ObjectType()
export class DeleteUploadedDocumentResult extends ResolverResult {}

@ObjectType()
export class ApplicationStepOneDraftResult extends ResolverResult {
  @Field(() => Application, { nullable: true })
  application: Application;
}

@ObjectType()
export class ApplicationStepOneSubmitResult extends ResolverResult {
  @Field(() => Application, { nullable: true })
  application: Application;
}

@ObjectType()
export class ApplicationStepTwoDraftResult extends ResolverResult {
  @Field(() => ApplicationStepTwoDraft, { nullable: true })
  application: ApplicationStepTwoDraft;
}

@ObjectType()
export class ApplicationStepTwoSubmitResult extends ResolverResult {
  @Field(() => ApplicationStepTwoDraft)
  application: ApplicationStepTwoDraft;
}

@ObjectType()
export class ApplicationStateQueryResult extends ResolverResult {
  @Field(() => Application)
  application: Application;
}

@Service()
@ArgsType()
class GetApplicationStepOneArgs {
  @Field({ nullable: false })
  id: string;
}


@Resolver(() => Application)
export class ApplicationResolver {
  constructor(
    @InjectRepository(Application)
    private readonly applicationRepository: Repository<Application>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(FileReference)
    private readonly fileReferenceRepository: Repository<FileReference>
  ) {}

  @Authorized()
  @Query(() => [Application])
  applications(@Ctx() ctx: MyContext) {
    const userId = ctx.req.user?.userId;
    return this.applicationRepository.find({ where: { userId } });
  }

  @Authorized()
  @Query(() => Application)
  application(
    @Ctx() ctx: MyContext,
    @Arg("id", { nullable: false }) id: string
  ) {
    const userId = ctx.req.user?.userId;
    return this.applicationRepository.findOne({
      where: { id, userId },
      relations: ["categories", "user"],
    });
  }

  @Authorized()
  @Query(() => ApplicationStateQueryResult)
  async getApplicationState(
    @Ctx() ctx: MyContext,
    @Arg("id", { nullable: true }) id?: string
  ) {
    const result = new ApplicationStateQueryResult();
    const userId = ctx.req.user?.userId;
    let application: Application | undefined;
    if (id && userId) {
      application = await this.applicationRepository.findOne({
        where: { id: id, userId: userId },
        relations: ["categories", "user"],
      });
    } else if (userId) {
      application = await this.applicationRepository.findOne({
        where: { userId },
        relations: ["categories", "user"],
      });
    } else {
      throw new Error(ERROR_CODES.AUTHENTICATION_REQUIRED);
    }
    if (!application) {
      result.addProblem({
        code: "UNKNOWN_ID",
        message: "No application found for given user",
      });
    } else {
      result.application = application;
    }
    return result;
  }

  @Authorized()
  @Query(() => Application)
  async getApplicationStepOne(
      @Ctx() ctx: MyContext,
      @Args() { id }: GetApplicationStepOneArgs
  ) {
    const user = await getLoggedInUser(ctx)
    if (isAdmin(user)) {
      return this.applicationRepository.findOne({
        where: { id: id },
        relations: ["categories", "user"],
      });
    } else {
      return this.applicationRepository.findOne({
        where: { id: id, userId: user.id },
        relations: ["categories", "user"],
      });
    }
  }

  @Authorized()
  @Query(() => ApplicationStepTwoDraftResult)
  async getApplicationStepTwo(@Ctx() ctx: MyContext) {
    const result = new ApplicationStepTwoDraftResult();
    const user = await this.userRepository.findOne(ctx.req.user.userId);
    if (!user) {
      throw new Error(ERROR_CODES.AUTHENTICATION_REQUIRED);
    }

    const application = await this.applicationRepository.findOne(
      { user: user },
      { relations: ["fileReferences", "user"] }
    );
    if (application) {
      result.application =
        ApplicationStepTwoDraft.mapApplicationToDraft(application);
    }
    return result;
  }

  private async createApplicationDraft(
    applicationDraft: ApplicationStepOneDraft,
    user: User,
    categories: Category[]
  ) {
    const application = this.applicationRepository.create({
      ...applicationDraft,
      user,
      categories,
      applicationState: ApplicationState.DRAFT,
    });
    return await application.save();
  }

  @Authorized()
  @Mutation(() => ApplicationStepOneDraftResult)
  async createOrUpdateApplicationDraft(
    @Args() applicationDraft: ApplicationStepOneDraft,
    @Ctx() ctx: MyContext
  ) {
    const result = new ApplicationStepOneDraftResult();
    const categories = await this.categoryRepository.findByIds(
      defaultTo([], applicationDraft.categoryIds)
    );
    const user = await this.userRepository.findOne(ctx.req.user.userId);
    if (!user) {
      throw new Error(ERROR_CODES.AUTHENTICATION_REQUIRED);
    }
    const update = applicationDraft.id && user;

    if (!update) {
      const created = await this.createApplicationDraft(
        applicationDraft,
        user!,
        categories
      );
      result.application = created;
    } else {
      const application = await this.applicationRepository.findOne(
        applicationDraft.id,
        { relations: ["categories"] }
      );
      const updated = application!.updateApplicationStepOne(
        applicationDraft,
        categories
      );
      result.application = await updated?.save();
    }
    return result;
  }

  @Authorized()
  @Mutation(() => ApplicationStepTwoDraftResult)
  async updateApplicationStepTwoDraft(
    @Args() applicationStepTwoDraft: ApplicationStepTwoDraftVariables,
    @Ctx() ctx: MyContext
  ) {
    const result = new ApplicationStepTwoDraftResult();
    const user = await this.userRepository.findOne(ctx.req.user.userId);
    if (!user) {
      throw new Error(ERROR_CODES.AUTHENTICATION_REQUIRED);
    }

    const application = await this.applicationRepository.findOne(
      {
        id: applicationStepTwoDraft.id,
        user: user,
      },
      { relations: ["fileReferences", "user"] }
    );
    if (!application) {
      result.addProblem({
        code: "UNKNOWN_ID",
        message: "No application found for given id!",
      });
    } else {
      const updated = await application.updateApplicationStepTwo(
        applicationStepTwoDraft
      );
      const saved = await updated.save();
      result.application = ApplicationStepTwoDraft.mapApplicationToDraft(saved);
    }
    return result;
  }

  @Authorized()
  @Mutation(() => ApplicationStepOneSubmitResult, {
    description: "For updating the draft of the first step of the application",
  })
  async submitApplicationStepOne(
    @Args() applicationSubmit: ApplicationStepOneSubmit,
    @Ctx() ctx: MyContext
  ) {
    const result = new ApplicationStepOneSubmitResult();
    const applicationToUpdate = await this.applicationRepository.findOne(
      applicationSubmit.id
    );
    const categories = await this.categoryRepository.findByIds(
      defaultTo([], applicationSubmit.categoryIds)
    );
    if (!applicationToUpdate) {
      const user = await this.userRepository.findOne(ctx.req.user.userId);
      if (!user) {
        throw new Error(ERROR_CODES.UNAUTHORIZED);
      }
      const application = await this.createApplicationDraft(
        applicationSubmit,
        user!,
        categories
      );
      Application.update(application, {
        applicationState: ApplicationState.PENDING,
      });
      result.application = application;
    } else {
      applicationToUpdate.setSubmitted(ApplicationStep.STEP_1);
      await Application.merge(applicationToUpdate, applicationSubmit, {
        applicationState: ApplicationState.PENDING,
      });
      applicationToUpdate.categories = categories.slice();
      const updated = await applicationToUpdate.save();
      result.application = updated;
    }
    return result;
  }

  @Authorized()
  @Mutation(() => ApplicationStepTwoSubmitResult, {
    description: "For updating the draft of the second step of the application",
  })
  async submitApplicationStepTwo(
    @Args() applicationStepTwoSubmit: ApplicationStepTwoDraftVariables,
    @Ctx() ctx: MyContext
  ) {
    const result = new ApplicationStepTwoSubmitResult();
    const applicationToUpdate = await this.applicationRepository.findOne(
      applicationStepTwoSubmit.id,
      { relations: ["fileReferences", "user"] }
    );
    if (!applicationToUpdate) {
      result.addProblem({
        code: "UNKNOWN_ID",
        message: "The application with the given was not found!",
      });
    } else {
      const updated = applicationToUpdate.updateApplicationStepTwo(
        applicationStepTwoSubmit
      );
      updated.setSubmitted(ApplicationStep.STEP_2);
      const saved = await updated.save();
      result.application =
        ApplicationStepTwoDraft.mapApplicationToDraft(updated);
    }
    return result;
  }

  @Authorized()
  @Mutation(() => ApplicationDocumentUploadResult)
  async uploadApplicationDocument(
    @Arg("id", () => ID!) id: string,
    @Arg("mapsToField", () => String) mapsToField: string,
    @Arg("documents", () => [GraphQLUpload]) documents: FileUpload[],
    @Ctx() ctx: MyContext
  ) {
    const result = new ApplicationDocumentUploadResult();
    const user = await this.userRepository.findOne(ctx.req.user.userId);

    if (!user) {
      throw new Error(ERROR_CODES.AUTHENTICATION_REQUIRED);
    } else {
      const application = await this.applicationRepository.findOne({
        id: id,
        user,
      });

      if (application) {
        const savedFiles: FileReference[] = [];
        result.application = application;
        for (const document of documents) {
          const { createReadStream, filename, mimetype } = await document;
          const path = await saveFile(id, createReadStream, filename);
          const reference = FileReference.create({
            application: application,
            filename: filename,
            path: path,
            mapsToField: mapsToField,
            mimetype: mimetype,
          });
          savedFiles.push(await reference.save());
        }
        result.savedFiles = savedFiles;
      } else {
        result.addProblem({
          code: "UNKNOWN_ID",
          message: "Application not found with given id!",
        });
      }
    }

    return result;
  }

  @Authorized()
  @Mutation(() => DeleteUploadedDocumentResult)
  async deleteUploadedFile(
    @Arg("id", () => ID!) id: string,
    @Ctx() ctx: MyContext
  ) {
    const result = new DeleteUploadedDocumentResult();
    const user = await this.userRepository.findOne(ctx.req.user.userId);
    if (!user) {
      throw new Error(ERROR_CODES.AUTHENTICATION_REQUIRED);
    } else {
      const fileRef = await this.fileReferenceRepository.findOne(id);
      if (fileRef) {
        deleteFile(fileRef.path);
        fileRef.remove();
      } else {
        result.addProblem({
          code: "UNKNOWN_ID",
          message: "There was an error deleting the file",
        });
      }
      return result;
    }
  }
}
