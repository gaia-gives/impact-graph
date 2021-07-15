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

import { Application } from "../entities/application";
import { Category } from "../entities/category";
import { User } from "../entities/user";
import { MyContext } from "../types/MyContext";

@ArgsType()
class CreateApplicationArgs {
  @Field({ nullable: false })
  legalName: string;

  @Field({ nullable: false })
  dba: string;

  @Field({ nullable: true })
  address: string;

  @Field({ nullable: false })
  email: string;

  @Field({ nullable: false })
  missionStatement: string;

  @Field({ nullable: true })
  website: string;

  @Field(() => [String], { nullable: true })
  socialMediaUrls: string[];

  @Field(() => [Int])
  categoryIds: number[];
}

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
    const user = await this.categoryRepository.findOne(ctx.req.user.userId);

    const application = this.applicationRepository.create({
      ...createApplicationArgs,
      user,
      categories,
    });
    return application.save();
  }
}
