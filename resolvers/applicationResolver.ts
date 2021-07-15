import { ImpactLocation } from './../entities/impactLocation';
import {
  Resolver,
  Query,
  Arg,
  Mutation,
  Args,
  ArgsType,
  Field,
  Int,
  Ctx,
} from "type-graphql";
import { Repository } from "typeorm";
import { InjectRepository } from "typeorm-typedi-extensions";

import {
  Application,
  FundingType,
  MainInterestReason,
  OrganisationType,
} from "../entities/application";
import { Category } from "../entities/category";
import { MyContext } from "../types/MyContext";

@ArgsType()
class CreateApplicationArgs {
  @Field({ nullable: false })
  legalName!: string;

  @Field({ nullable: true })
  address: string;

  @Field({ nullable: false })
  email: string;

  @Field({ nullable: false })
  missionStatement!: string;

  @Field({ nullable: false })
  plannedProjects!: string;

  @Field({ nullable: true })
  primaryImpactLocationId: number;

  primaryImpactLocation?: ImpactLocation;

  @Field({ nullable: true })
  website: string;

  @Field(() => [String], { nullable: true })
  socialMediaUrls: string[];

  @Field(() => [Int])
  categoryIds: number[];

  @Field(() => OrganisationType, { nullable: true })
  organisationType?: OrganisationType;

  @Field(() => MainInterestReason, { nullable: true })
  mainInterestReason?: MainInterestReason;

  @Field(() => FundingType, {
    nullable: true,
    defaultValue: FundingType.single,
  })
  fundingType?: FundingType;

  @Field({ nullable: false, defaultValue: false })
  acceptFundingFromCorporateSocialResponsibilityPartner!: boolean;

  @Field({ nullable: false, defaultValue: 4000 })
  plannedFunding!: number;

  @Field({ description: "How the organization plans to use the account" })
  accountUsagePlan!: string;
}

@Resolver(() => Application)
export class ApplicationResolver {
  constructor(
    @InjectRepository(Application)
    private readonly applicationRepository: Repository<Application>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(ImpactLocation)
    private readonly impactLocationRepository: Repository<ImpactLocation>
  ) {}

  @Query(() => [Application])
  applications() {
    return this.applicationRepository.find();
  }

  @Query(() => Application)
  application(@Arg("id", { nullable: false }) id: string) {
    return this.applicationRepository.findOne({
      where: { id },
      relations: ["categories"],
    });
  }

  @Mutation(() => Application)
  async createApplication(
    @Args() createApplicationArgs: CreateApplicationArgs,
    @Ctx() ctx: MyContext
  ) {
    const categories = await this.categoryRepository.findByIds(
      createApplicationArgs.categoryIds
    );
    const impactLocation = await this.impactLocationRepository.findOne(createApplicationArgs.primaryImpactLocationId);
    const user = await this.categoryRepository.findOne(ctx.req.user.userId);

    createApplicationArgs.primaryImpactLocation = impactLocation;

    const application = this.applicationRepository.create({
      ...createApplicationArgs,
      user,
      categories
    });
    return application.save();
  }
}
