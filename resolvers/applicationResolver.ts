import { ResolverResult } from "./types/ResolverResult";
import { User } from "./../entities/user";
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
} from "type-graphql";
import { GraphQLUpload, FileUpload } from "graphql-upload";
import { Repository } from "typeorm";
import { InjectRepository } from "typeorm-typedi-extensions";
import { Application, ApplicationState } from "../entities/application";
import { Category } from "../entities/category";
import { MyContext } from "../types/MyContext";
import { ApplicationDraft } from "./types/application/application-draft";
import { defaultTo } from "ramda";
import { ApplicationSubmit } from "./types/application/application-submit";
import { saveFile } from "../utils/saveFile";

@ObjectType()
class ApplicationDocumentUploadResult extends ResolverResult {}

@Resolver(() => Application)
export class ApplicationResolver {
  constructor(
    @InjectRepository(Application)
    private readonly applicationRepository: Repository<Application>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  @Authorized()
  @Query(() => [Application])
  applications() {
    return this.applicationRepository.find();
  }

  @Authorized()
  @Query(() => Application)
  application(@Arg("id", { nullable: false }) id: string) {
    return this.applicationRepository.findOne({
      where: { id },
      relations: ["categories", "user"],
    });
  }

  @Authorized()
  @Query(() => Application)
  async applicationByUserId(@Ctx() ctx: MyContext) {
    const userId = ctx.req.user?.userId;
    if (userId) {
      return this.applicationRepository.findOne({
        where: { userId },
        relations: ["categories", "user"],
      });
    } else {
      return {};
    }
  }

  private async createApplicationDraft(
    applicationDraft: ApplicationDraft,
    user: User,
    categories: Category[]
  ) {
    const application = this.applicationRepository.create({
      ...applicationDraft,
      user,
      categories,
    });
    return await application.save();
  }

  private async updateApplicationDraft(applicationDraft: ApplicationDraft) {
    const applicationToUpdate = await this.applicationRepository.findOne(
      applicationDraft.id
    );
    if (applicationToUpdate) {
      await Application.merge(applicationToUpdate, applicationDraft);
      return await applicationToUpdate.save();
    } else {
      throw new Error("Application with given id not found!");
    }
  }

  @Authorized()
  @Mutation(() => Application)
  async createOrUpdateApplicationDraft(
    @Args() applicationDraft: ApplicationDraft,
    @Ctx() ctx: MyContext
  ) {
    const categories = await this.categoryRepository.findByIds(
      defaultTo([], applicationDraft.categoryIds)
    );

    const user = await this.userRepository.findOne(ctx.req.user.userId);
    const update = applicationDraft.id && user;

    if (!update) {
      return await this.createApplicationDraft(
        applicationDraft,
        user!,
        categories
      );
    } else {
      return await this.updateApplicationDraft(applicationDraft);
    }
  }

  @Authorized()
  @Mutation(() => Boolean, {
    description: "For updating the draft of an application",
  })
  async submitApplication(
    @Args() applicationSubmit: ApplicationSubmit,
    @Ctx() ctx: MyContext
  ) {
    const applicationToUpdate = await this.applicationRepository.findOne(
      applicationSubmit.id
    );
    if (!applicationToUpdate) {
      const categories = await this.categoryRepository.findByIds(
        defaultTo([], applicationSubmit.categoryIds)
      );
      const userId = parseInt(ctx.req.user.userId);
      const user = await this.userRepository.findOne(userId);
      const application = await this.createApplicationDraft(
        applicationSubmit,
        user!,
        categories
      );
      Application.update(application, {
        applicationState: ApplicationState.PENDING,
      });
      return true;
    } else {
      applicationSubmit.applicationState = ApplicationState.PENDING;
      await Application.merge(applicationToUpdate, applicationSubmit);
      await applicationToUpdate.save();
      return true;
    }
  }

  @Mutation(() => ApplicationDocumentUploadResult)
  async uploadApplicationDocument(
    @Arg("id", () => ID!) id: string,
    @Arg("documents", () => [GraphQLUpload]) documents: FileUpload[],
    @Ctx() ctx: MyContext
  ) {
    const result = new ApplicationDocumentUploadResult();
    const user = await this.userRepository.findOne(ctx.req.user.userId);
    
    if (!user) {
      result.setUnsuccessful({
        code: "UNKNOWN_ID",
        message: "User not found with given id!",
      });
    } else {
      const application = await this.applicationRepository.findOne({
        id: id,
        user,
      });
      
      if (application) {
        for (const document of documents) {
          const { createReadStream, filename } = await document;
          await saveFile(id, createReadStream, filename);
        }
      } else {
        result.setUnsuccessful({
          code: "UNKNOWN_ID",
          message: "Application not found with given id!",
        });
      }
    }

    return result;
  }
}
