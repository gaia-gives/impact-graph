import { User } from "./../entities/user";
import { ImpactLocation } from "./../entities/impactLocation";
import {
  Resolver,
  Query,
  Arg,
  Mutation,
  Args,
  Ctx,
  Authorized,
} from "type-graphql";
import { Repository } from "typeorm";
import { InjectRepository } from "typeorm-typedi-extensions";

import { Application, ApplicationState } from "../entities/application";
import { Category } from "../entities/category";
import { MyContext } from "../types/MyContext";
import { ApplicationDraft } from "./types/application/application-draft";
import { defaultTo } from "ramda";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";
import { ApplicationSubmit } from "./types/application/application-submit";

@Resolver(() => Application)
export class ApplicationResolver {
  constructor(
    @InjectRepository(Application)
    private readonly applicationRepository: Repository<Application>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(ImpactLocation)
    private readonly impactLocationRepository: Repository<ImpactLocation>,
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
      console.log("applicationUserId -->", userId);
      return this.applicationRepository.findOne({
        where: { userId },
        relations: ["categories", "user", "primaryImpactLocation"],
      });
    } else {
      return {};
    }
  }

  private async createApplicationDraft(
    applicationDraft: ApplicationDraft,
    user: User,
    categories: Category[],
    primaryImpactLocation: ImpactLocation
  ) {
    const application = this.applicationRepository.create({
      ...applicationDraft,
      user,
      categories,
      primaryImpactLocation,
    });
    return await application.save();
  }

  private async updateApplicationDraft(
    applicationDraft: ApplicationDraft,
    categories: Category[],
    primaryImpactLocation: ImpactLocation
  ) {
    const applicationToUpdate = await this.applicationRepository.findOne(
      applicationDraft.id
    );
    if (applicationToUpdate) {
      const partial: QueryDeepPartialEntity<Application> = {
        ...applicationDraft,
        categories,
        primaryImpactLocation,
      };
      return await Application.update(applicationToUpdate, partial);
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
    const primaryImpactLocation = await this.impactLocationRepository.findOne(
      defaultTo(0, applicationDraft.primaryImpactLocationId)
    );
    if (!primaryImpactLocation) throw new Error(`Cannot find primary impact location with id ${applicationDraft.primaryImpactLocationId}`)

    const user = await this.userRepository.findOne(ctx.req.user.userId);
    if (applicationDraft.id && user) {
      return await this.createApplicationDraft(
        applicationDraft,
        user,
        categories,
        primaryImpactLocation
      );
    } else {
      return await this.updateApplicationDraft(applicationDraft, categories, primaryImpactLocation)
    }
  }

  @Authorized()
  @Mutation(() => Boolean, {
    description: "For updating the draft of an application",
  })
  async submitApplication(@Args() applicationSubmit: ApplicationSubmit) {
    const applicationToUpdate = await this.applicationRepository.findOne(
      applicationSubmit.id
    );
    if (applicationToUpdate) {
      const categories = await this.categoryRepository.findByIds(
        defaultTo([], applicationSubmit.categoryIds)
      );
      const primaryImpactLocation = await this.impactLocationRepository.findOne(
        defaultTo(0, applicationSubmit.primaryImpactLocationId)
      );

      const partial: QueryDeepPartialEntity<Application> = {
        ...applicationSubmit,
        categories,
        primaryImpactLocation,
        applicationState: ApplicationState.PENDING,
      };
      await Application.update(applicationToUpdate, partial);
      return true;
    } else {
      throw new Error("Application with given id not found");
    }
  }
}
