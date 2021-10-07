import { Project } from "../entities/project";
import { InjectRepository } from "typeorm-typedi-extensions";
import { MyContext } from "../types/MyContext";
import { Max, Min } from "class-validator";
import { User } from "../entities/user";
import { Brackets, Repository } from "typeorm";
import { Service } from "typedi";
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
import { ProjectStatus } from "../entities/projectStatus";

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
    const userMessage = "Access denied";
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


@ArgsType()
class GetProjectArgs {
  @Field((type) => ID!, { defaultValue: 0 })
  id: number;
}

@Service()
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
      .leftJoinAndSelect("project.users", "users")
      .innerJoinAndSelect(
        "project.impactLocations",
        "il",
        locationsAreFilled ? "il.id IN (:...impactLocations)" : undefined,
        { impactLocations: locationsAreFilled ? locations : [] }
      )
      .where("project.status = :ongoing", { ongoing: ProjectStatus.ONGOING })
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
          status: ProjectStatus.ONGOING
        },
      });
    } else {
      [projects, totalCount] = await this.projectRepository
        .createQueryBuilder("project")
        .where("project.status = :ongoing", { ongoing: ProjectStatus.ONGOING })
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
