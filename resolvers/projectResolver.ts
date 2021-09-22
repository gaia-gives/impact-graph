import { ImpactLocation } from "./../entities/impactLocation";
import { Project, ProjectUpdate } from "../entities/project";
import { InjectRepository } from "typeorm-typedi-extensions";
import { ProjectStatus, ProjStatus } from "../entities/projectStatus";
import { UserPermissions } from "../permissions";
import { Donation } from "../entities/donation";
import { MyContext } from "../types/MyContext";
import { Max, Min } from "class-validator";
import { User } from "../entities/user";
import { Brackets, Repository } from "typeorm";
import { Service } from "typedi";
import Logger from "../logger";
import {
  Arg,
  Args,
  ArgsType,
  Field,
  ID,
  InputType,
  Int,
  ObjectType,
  Query,
  registerEnumType,
  Resolver,
} from "type-graphql";

import { Category } from "../entities/category";

@ObjectType()
class TopProjects {
  @Field((type) => [Project])
  projects: Project[];

  @Field((type) => Int)
  totalCount: number;
}

enum OrderField {
  CreationDate = "creationDate",
  Balance = "balance",
}

enum OrderDirection {
  ASC = "ASC",
  DESC = "DESC",
}

registerEnumType(OrderField, {
  name: "OrderField",
  description: "Order by field",
});

registerEnumType(OrderDirection, {
  name: "OrderDirection",
  description: "Order direction",
});
function checkIfUserInRequest(ctx: MyContext) {
  if (!ctx.req.user) {
    throw new Error("Access denied");
  }
}
async function getLoggedInUser(ctx: MyContext) {
  checkIfUserInRequest(ctx);

  const user = await User.findOne({ id: ctx.req.user.userId });

  if (!user) {
    const errorMessage = `No user with userId ${ctx.req.user.userId} found. This userId comes from the token. Please check the pm2 logs for the token. Search for 'Non-existant userToken' to see the token`;
    const userMessage = "Access denied";
    Logger.captureMessage(errorMessage);
    console.error(
      `Non-existant userToken for userId ${ctx.req.user.userId}. Token is ${ctx.req.user.token}`
    );
    throw new Error(userMessage);
  }

  return user;
}

@InputType()
class OrderBy {
  @Field((type) => OrderField)
  field: OrderField;

  @Field((type) => OrderDirection)
  direction: OrderDirection;
}

@Service()
@ArgsType()
class GetProjectsArgs {
  @Field((type) => Int, { defaultValue: 0 })
  @Min(0)
  skip: number;

  @Field((type) => Int, { defaultValue: 0 })
  @Min(0)
  @Max(50)
  take: number;

  @Field((type) => OrderBy, {
    defaultValue: { field: OrderField.Balance, direction: OrderDirection.DESC },
  })
  orderBy: OrderBy;

  @Field({ nullable: true })
  category: string;

  @Field({ nullable: true })
  admin?: number;

  @Field((type) => [Category], { defaultValue: [] })
  categories: Category[];

  @Field((type) => [Int], { defaultValue: [] })
  locations: number[];

  @Field((type) => String, { defaultValue: "" })
  searchTerm: string;
}

@Service()
@ArgsType()
class GetProjectArgs {
  @Field((type) => ID!, { defaultValue: 0 })
  id: number;
}

@Resolver((of) => Project)
export class ProjectResolver {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>, 
  ) {}

  @Query((returns) => [Project])
  async projects(
    @Args() { take, skip, categories, locations, searchTerm }: GetProjectsArgs
  ): Promise<Project[]> {
    const categoriesAreFilled = categories && categories.length > 0;
    const locationsAreFilled = locations && locations.length > 0;

    const queryBuilder = this.projectRepository
      .createQueryBuilder("project")
      .leftJoinAndSelect("project.donations", "donations")
      .leftJoinAndSelect("project.status", "status")
      .leftJoinAndSelect("project.users", "users")
      .innerJoinAndSelect(
        "project.impactLocations",
        "il",
        locationsAreFilled ? "il.id IN (:...impactLocations)" : undefined,
        { impactLocations: locationsAreFilled ? locations : [] }
      )
      .where("project.statusId = 5")
      .andWhere(
        new Brackets((qb) => {
          qb.where(":searchTerm = ''").orWhere(
            "project.title ILIKE :searchTerm",
            { searchTerm: `%${searchTerm}%` }
          );
        })
      );

    if (categoriesAreFilled) {
      queryBuilder.andWhere("project.categories && (:categories)", {
        categories: categories
      });
    }
    
    let projects;
    [projects] = await queryBuilder
      .orderBy(`project.qualityScore`, "DESC")
      .limit(skip)
      .take(take)
      .getManyAndCount();

    return projects;
  }

  @Query((returns) => TopProjects)
  async topProjects(
    @Args() { take, skip, orderBy, category }: GetProjectsArgs
  ): Promise<TopProjects> {
    const { field, direction } = orderBy;
    const order = {};
    order[field] = direction;

    let projects;
    let totalCount;

    if (!category) {
      [projects, totalCount] = await this.projectRepository.findAndCount({
        take,
        skip,
        order,
        where: {
          status: {
            id: ProjStatus.act,
          },
        },
      });
    } else {
      [projects, totalCount] = await this.projectRepository
        .createQueryBuilder("project")
        .where("project.statusId = 5")
        .orderBy(`project.${field}`, direction)
        .limit(skip)
        .take(take)
        .getManyAndCount();
    }
    return { projects, totalCount };
  }

  @Query((returns) => Project)
  async project(@Args() { id }: GetProjectArgs) {
    const project = await this.projectRepository.findOneOrFail(
      { id },
      { relations: ["organisation"] }
    );
    project.milestones.sort((a, b) => (a.status > b.status ? -1 : 1));
    return project;
  }
}
