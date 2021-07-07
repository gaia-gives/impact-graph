import { ImpactLocation } from "./../entities/impactLocation";
import NotificationPayload from "../entities/notificationPayload";
import { Reaction, REACTION_TYPE } from "../entities/reaction";
import { Project, ProjectUpdate } from "../entities/project";
import { InjectRepository } from "typeorm-typedi-extensions";
import { ProjectStatus } from "../entities/projectStatus";
import { ProjectInput, ImageUpload } from "./types/project-input";
import { PubSubEngine } from "graphql-subscriptions";
import { pinFile } from "../middleware/pinataUtils";
import { UserPermissions } from "../permissions";
import { Category } from "../entities/category";
import { Donation } from "../entities/donation";
import { triggerBuild } from "../netlify/build";
import { MyContext } from "../types/MyContext";
import { getAnalytics } from "../analytics";
import { Max, Min } from "class-validator";
import { User } from "../entities/user";
import { Context } from "../context";
import {
  Brackets,
  QueryBuilder,
  Repository,
  SelectQueryBuilder,
} from "typeorm";
import { Service } from "typedi";
import config from "../config";
import slugify from "slugify";
import Logger from "../logger";
import { getProvider } from "../provider";
import {
  Arg,
  Args,
  ArgsType,
  Ctx,
  Field,
  ID,
  InputType,
  Int,
  Mutation,
  ObjectType,
  PubSub,
  Query,
  registerEnumType,
  Resolver,
} from "type-graphql";

function isSmartContract(provider) {
  return async function (projectWalletAddress) {
    const code = await provider.getCode(projectWalletAddress);

    return code !== "0x";
  };
}

const mainnetProvider = getProvider("mainnet");
const xdaiProvider = getProvider("xdaiChain");
const isSmartContractMainnet = isSmartContract(mainnetProvider);
const isSmartContractXDai = isSmartContract(xdaiProvider);

const analytics = getAnalytics();

enum ProjStatus {
  rjt = 1,
  pen = 2,
  clr = 3,
  ver = 4,
  act = 5,
  can = 6,
  del = 7,
}
import { inspect } from "util";

@ObjectType()
class TopProjects {
  @Field((type) => [Project])
  projects: Project[];

  @Field((type) => Int)
  totalCount: number;
}

@ObjectType()
class WalletAddressIsValidResponse {
  @Field((type) => Boolean)
  isValid: boolean;

  @Field((type) => [String])
  reasons: string[];
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

  @Field((type) => [Int], { defaultValue: [] })
  categories: number[];

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

@ObjectType()
class GetProjectUpdatesResult {
  @Field((type) => ProjectUpdate)
  projectUpdate: ProjectUpdate;

  @Field((type) => [Reaction])
  reactions: Reaction[];
}

@ObjectType()
class ToggleResponse {
  @Field((type) => Boolean)
  reaction: boolean;

  @Field((type) => Number)
  reactionCount: number;
}

@Resolver((of) => Project)
export class ProjectResolver {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    @InjectRepository(ProjectStatus)
    private readonly projectStatusRepository: Repository<ProjectStatus>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private userPermissions: UserPermissions,
    @InjectRepository(Donation)
    private readonly donationRepository: Repository<Donation>,
    @InjectRepository(ImpactLocation)
    private readonly impactLocationRepository: Repository<ImpactLocation>
  ) {}

  @Query((returns) => [Project])
  async projects(
    @Args() { take, skip, categories, locations, searchTerm }: GetProjectsArgs
  ): Promise<Project[]> {
    const categoriesAreFilled = categories && categories.length > 0;
    const locationsAreFilled = locations && locations.length > 0;

    const queryBuilder = this.projectRepository
      .createQueryBuilder("project")
      .leftJoinAndSelect("project.reactions", "reactions")
      .leftJoinAndSelect("project.donations", "donations")
      .leftJoinAndSelect("project.status", "status")
      .leftJoinAndSelect("project.users", "users")
      .innerJoinAndSelect(
        "project.categories",
        "c",
        categoriesAreFilled ? "c.id IN (:...categories)" : undefined,
        { categories: categoriesAreFilled ? categories : [] }
      )
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

    let projects;
    let totalCount;
    [projects, totalCount] = await queryBuilder
      .orderBy(`project.qualityScore`, "DESC")
      .limit(skip)
      .take(take)
      .getManyAndCount();

    function sum(items, prop) {
      return items.reduce(function (a, b) {
        return a + b[prop];
      }, 0);
    }

    const withTotal = projects.map((project) => {
      return {
        ...project,
        totalDonations: sum(project.donations, "valueUsd"),
        totalHearts: project.reactions.length,
      };
    });

    return withTotal;
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
        relations: ["reactions"],
        where: {
          status: {
            id: ProjStatus.act,
          },
        },
      });
    } else {
      [projects, totalCount] = await this.projectRepository
        .createQueryBuilder("project")
        .innerJoin(
          "project.categories",
          "category",
          "category.name = :category",
          { category }
        )
        .innerJoin("project.reactions", "reaction")
        .where("project.statusId = 5")
        .orderBy(`project.${field}`, direction)
        .limit(skip)
        .take(take)
        .innerJoinAndSelect("project.categories", "c")
        .getManyAndCount();
    }
    return { projects, totalCount };
  }

  @Query((returns) => Project)
  async project(@Args() { id }: GetProjectArgs) {
    const project = await this.projectRepository.findOneOrFail({ id }, { relations: ["organisation"] });
    project.milestones.sort((a,b) => a.status > b.status ? -1 : 1);
    return project;
  }

  //Move this to it's own resolver later
  @Query((returns) => Project)
  async projectBySlug(@Arg("slug") slug: string) {
    return await this.projectRepository.findOne({
      where: { slug },
      relations: ["donations", "reactions"],
    });
  }

  @Mutation((returns) => Project)
  async editProject(
    @Arg("projectId") projectId: number,
    @Arg("newProjectData") newProjectData: ProjectInput,
    @Ctx() { req: { user } }: MyContext,
    @PubSub() pubSub: PubSubEngine
  ) {
    if (!user) throw new Error("Authentication required.");

    const project = await Project.findOne({ id: projectId });

    if (!project) throw new Error("Project not found.");
    if (project.admin != user.userId)
      throw new Error("You are not the owner of this project.");

    for (const field in newProjectData) project[field] = newProjectData[field];

    if (newProjectData.categories) {
      const categoriesPromise = newProjectData.categories.map(
        async (category) => {
          let [c] = await this.categoryRepository.find({ name: category });
          if (c === undefined) {
            c = new Category();
            c.name = category;
          }
          return c;
        }
      );

      const categories = await Promise.all(categoriesPromise);
      project.categories = categories;
    }

    if (newProjectData.impactLocations) {
      const impactLocationPromise = newProjectData.impactLocations.map(
        async (impactLocation) => {
          let [il] = await this.impactLocationRepository.find({
            name: impactLocation,
          });
          if (il === undefined) {
            il = new ImpactLocation();
            il.name = impactLocation;
          }
          return il;
        }
      );

      const impactLocations = await Promise.all(impactLocationPromise);
      project.impactLocations = impactLocations;
    }

    const { imageUpload, imageStatic } = newProjectData;
    if (imageUpload) {
      const { filename, createReadStream, encoding } = await imageUpload;

      try {
        project.image = await pinFile(
          createReadStream(),
          filename,
          encoding
        ).then((response) => {
          return "https://gateway.pinata.cloud/ipfs/" + response.data.IpfsHash;
        });
      } catch (e) {
        console.error(e);
        throw Error("Upload file failed");
      }
    } else if (imageStatic) {
      project.image = imageStatic;
    }

    const [hearts, heartCount] = await Reaction.findAndCount({
      projectId: projectId,
    });

    let qualityScore = this.getQualityScore(
      project.description,
      !!imageUpload,
      heartCount
    );
    project.qualityScore = qualityScore;
    await project.save();

    if (config.get("TRIGGER_BUILD_ON_NEW_PROJECT") === "true")
      triggerBuild(projectId);

    return project;
  }

  //getQualityScore (projectInput) {
  getQualityScore(description, hasImageUpload, heartCount) {
    const heartScore = 10;
    let qualityScore = 40;

    if (description.length > 100) qualityScore = qualityScore + 10;
    if (hasImageUpload) qualityScore = qualityScore + 30;

    if (heartCount) {
      qualityScore = heartCount * heartScore;
    }
    return qualityScore;
  }

  @Mutation((returns) => String)
  async uploadImage(
    @Arg("imageUpload") imageUpload: ImageUpload,
    @Ctx() ctx: MyContext
  ): Promise<string> {
    //const user = await getLoggedInUser(ctx)
    let url = "";

    if (imageUpload.image) {
      const { filename, createReadStream, encoding } = await imageUpload.image;

      try {
        const response = await pinFile(createReadStream(), filename, encoding);
        url = "https://gateway.pinata.cloud/ipfs/" + response.data.IpfsHash;
      } catch (e) {
        throw Error("Upload file failed");
      }
    }

    return url;
  }

  @Mutation((returns) => Project)
  async addProject(
    @Arg("project") projectInput: ProjectInput,
    @Ctx() ctx: MyContext,
    @PubSub() pubSub: PubSubEngine
  ): Promise<Project> {
    const user = await getLoggedInUser(ctx);

    let qualityScore = this.getQualityScore(
      projectInput.description,
      !!projectInput.imageUpload,
      0
    );

    const categoriesPromise = Promise.all(
      projectInput.categories
        ? projectInput.categories.map(async (category) => {
            let [c] = await this.categoryRepository.find({ name: category });
            if (c === undefined) {
              c = new Category();
              c.name = category;
            }
            return c;
          })
        : []
    );

    const impactLocationPromise = Promise.all(
      projectInput.impactLocations
        ? projectInput.impactLocations.map(async (impactLocation) => {
            let [il] = await this.impactLocationRepository.find({
              name: impactLocation,
            });
            if (il === undefined) {
              (il = new ImpactLocation()), (il.name = impactLocation);
            }
            return il;
          })
        : []
    );

    let imagePromise: Promise<string | undefined> = Promise.resolve(undefined);

    const { imageUpload, imageStatic } = projectInput;
    if (imageUpload) {
      const { filename, createReadStream, encoding } = await imageUpload;
      try {
        imagePromise = pinFile(createReadStream(), filename, encoding).then(
          (response) => {
            return (
              "https://gateway.pinata.cloud/ipfs/" + response.data.IpfsHash
            );
          }
        );
      } catch (e) {
        console.error(e);
        throw Error("Upload file failed");
      }
    } else if (imageStatic) {
      imagePromise = Promise.resolve(imageStatic);
    }

    const [categories, impactLocations, image] = await Promise.all([
      categoriesPromise,
      impactLocationPromise,
      imagePromise,
    ]);
    const slugBase = slugify(projectInput.title);

    let slug = slugBase;
    for (let i = 1; await this.projectRepository.findOne({ slug }); i++) {
      slug = slugBase + "-" + i;
    }

    const status = await this.projectStatusRepository.findOne({
      id: 5,
    });

    const project = this.projectRepository.create({
      ...projectInput,
      categories,
      impactLocations,
      image,
      creationDate: new Date(),
      slug: slug.toLowerCase(),
      admin: ctx.req.user.userId,
      users: [user],
      status,
      qualityScore,
      verified: false,
      giveBacks: false,
    });

    const newProject = await this.projectRepository.save(project);

    const update = await ProjectUpdate.create({
      userId: ctx.req.user.userId,
      projectId: newProject.id,
      content: "",
      title: "",
      createdAt: new Date(),
      isMain: true,
    });
    await ProjectUpdate.save(update);

    const payload: NotificationPayload = {
      id: 1,
      message: "A new project was created",
    };
    const segmentProject = {
      email: project.users[0].email,
      projectOwnerEmail: project.users[0].email,
      title: project.title,
      projectOwnerLastName: project.users[0].lastName,
      projectOwnerFirstName: project.users[0].firstName,
      projectOwnerId: project.admin,
      slug: project.slug,
      projectWalletAddress: project.walletAddress,
    };

    const formattedProject = {
      ...projectInput,
      description: projectInput?.description?.replace(/<img .*?>/g, ""),
    };
    analytics.track(
      "Project created",
      `givethId-${ctx.req.user.userId}`,
      formattedProject,
      null
    );

    await pubSub.publish("NOTIFICATIONS", payload);

    if (config.get("TRIGGER_BUILD_ON_NEW_PROJECT") === "true")
      triggerBuild(newProject.id);

    return newProject;
  }

  @Mutation((returns) => ProjectUpdate)
  async addProjectUpdate(
    @Arg("projectId") projectId: number,
    @Arg("title") title: string,
    @Arg("content") content: string,
    @Ctx() { req: { user } }: MyContext,
    @PubSub() pubSub: PubSubEngine
  ): Promise<ProjectUpdate> {
    if (!user) throw new Error("Authentication required.");

    const project = await Project.findOne({ id: projectId });

    if (!project) throw new Error("Project not found.");
    if (project.admin != user.userId)
      throw new Error("You are not the owner of this project.");

    const update = await ProjectUpdate.create({
      userId: user.userId,
      projectId: project.id,
      content,
      title,
      createdAt: new Date(),
      isMain: false,
    });

    analytics.track(
      "Project updated - owner",
      `givethId-${user.userId}`,
      {
        project,
        update: title,
      },
      null
    );

    const donations = await this.donationRepository.find({
      where: { project: { id: project.id } },
      relations: ["user"],
    });

    donations.forEach((donation) => {
      analytics.track(
        "Project updated - donor",
        `givethId-${donation.user.id}`,
        {
          project,
          update: title,
          donation,
        },
        null
      );
    });
    return ProjectUpdate.save(update);
  }

  @Mutation((returns) => Boolean)
  async toggleReaction(
    @Arg("updateId") updateId: number,
    @Arg("reaction") reaction: REACTION_TYPE = "heart",
    @Ctx() { req: { user } }: MyContext,
    @PubSub() pubSub: PubSubEngine
  ): Promise<boolean> {
    if (!user) throw new Error("Authentication required.");

    const update = await ProjectUpdate.findOne({ id: updateId });
    if (!update) throw new Error("Update not found.");

    //if there is one, then delete it
    const currentReaction = await Reaction.findOne({
      projectUpdateId: update.id,
      userId: user.userId,
    });

    let project = await Project.findOne({ id: update.projectId });
    if (!project) throw new Error("Project not found");

    if (currentReaction && currentReaction.reaction === reaction) {
      await Reaction.delete({
        projectUpdateId: update.id,
        userId: user.userId,
      });

      //increment qualityScore
      project.updateQualityScoreHeart(false);
      project.save();
      return false;
    } else {
      //if there wasn't one, then create it
      const newReaction = await Reaction.create({
        userId: user.userId,
        projectUpdateId: update.id,
        reaction,
      });

      project.updateQualityScoreHeart(true);
      project.save();

      await Reaction.save(newReaction);
    }

    return true;
  }

  @Mutation((returns) => ToggleResponse)
  async toggleProjectReaction(
    @Arg("projectId") projectId: number,
    @Arg("reaction") reaction: REACTION_TYPE = "heart",
    @Ctx() { req: { user } }: MyContext,
    @PubSub() pubSub: PubSubEngine
  ): Promise<object> {
    if (!user) throw new Error("Authentication required.");

    let project = await Project.findOne({ id: projectId });

    if (!project) throw new Error("Project not found.");

    let update = await ProjectUpdate.findOne({ projectId, isMain: true });
    if (!update) {
      update = await ProjectUpdate.save(
        await ProjectUpdate.create({
          userId:
            project && project.admin && +project.admin ? +project.admin : 0,
          projectId,
          content: "",
          title: "",
          createdAt: new Date(),
          isMain: true,
        })
      );
    }

    const usersReaction = await Reaction.findOne({
      projectUpdateId: update.id,
      userId: user.userId,
    });
    const [, reactionCount] = await Reaction.findAndCount({
      projectUpdateId: update.id,
    });

    await Reaction.delete({ projectUpdateId: update.id, userId: user.userId });
    const response = new ToggleResponse();
    response.reactionCount = reactionCount;

    if (usersReaction && usersReaction.reaction === reaction) {
      response.reaction = false;
      response.reactionCount = response.reactionCount - 1;
    } else {
      const newReaction = await Reaction.create({
        userId: user.userId,
        projectUpdateId: update.id,
        reaction,
        project,
      });

      await Reaction.save(newReaction);
      response.reactionCount = response.reactionCount + 1;
      response.reaction = true;
    }
    return response;
  }

  @Query((returns) => [GetProjectUpdatesResult])
  async getProjectUpdates(
    @Arg("projectId") projectId: number,
    @Arg("skip") skip: number,
    @Arg("take") take: number,
    @Ctx() { user }: Context,
    @PubSub() pubSub: PubSubEngine
  ): Promise<GetProjectUpdatesResult[]> {
    const updates = await ProjectUpdate.find({
      where: { projectId, isMain: false },
      skip,
      take,
    });

    const results: GetProjectUpdatesResult[] = [];

    for (const update of updates)
      results.push({
        projectUpdate: update,
        reactions: await Reaction.find({
          where: { projectUpdateId: update.id },
        }),
      });

    return results;
  }

  @Query((returns) => [Reaction])
  async getProjectReactions(
    @Arg("projectId") projectId: number,
    @Ctx() { user }: Context,
    @PubSub() pubSub: PubSubEngine
  ): Promise<Reaction[]> {
    const update = await ProjectUpdate.findOne({
      where: { projectId, isMain: true },
    });

    return await Reaction.find({
      where: { projectUpdateId: update?.id || -1 },
    });
  }

  @Query((returns) => Boolean)
  async isWalletSmartContract(@Arg("address") address: string) {
    const isContractPromises: any = [];
    isContractPromises.push(isSmartContractMainnet(address));
    isContractPromises.push(isSmartContractXDai(address));

    return Promise.all(isContractPromises).then((promises) => {
      const [isSmartContractOnMainnet, isSmartContractOnXDai] = promises;
      if (isSmartContractOnMainnet || isSmartContractOnXDai) {
        return true;
      } else {
        return false;
      }
    });
  }

  /**
   * Can a project use this wallet?
   * @param address wallet address
   * @returns
   */
  @Query((returns) => WalletAddressIsValidResponse)
  async walletAddressIsValid(@Arg("address") address: string) {
    const isSmartContractWallet = await this.isWalletSmartContract(address);
    const reasons: string[] = [];
    if (isSmartContractWallet) {
      reasons.push("smart-contract");
    }
    const projectWithAddress = await this.projectByAddress(address);
    const addressUsed = !!projectWithAddress;

    if (addressUsed) {
      reasons.push("address-used");
    }

    const isValid = !isSmartContractWallet && (addressUsed ? false : true);
    return {
      isValid: isValid,
      reasons,
    };
  }

  @Query((returns) => Project, { nullable: true })
  projectByAddress(@Arg("address", (type) => String) address: string) {
    return this.projectRepository.findOne({ walletAddress: address });
  }

  async updateProjectStatus(
    projectId: number,
    status: number,
    user: User
  ): Promise<Boolean> {
    const project = await Project.findOne({ id: projectId });

    if (project) {
      if (project.mayUpdateStatus(user)) {
        const projectStatus = await ProjectStatus.findOne({ id: status });
        if (projectStatus) {
          project.status = projectStatus;
          await project.save();
          return true;
        } else {
          throw new Error("No project status found, this should be impossible");
        }
      } else {
        throw new Error(
          "User does not have permission to update status on that project"
        );
      }
    } else {
      throw new Error("You tried to deactivate a non existant project");
    }
  }

  @Mutation((returns) => Boolean)
  async deactivateProject(
    @Arg("projectId") projectId: number,
    @Ctx() ctx: MyContext
  ): Promise<Boolean> {
    try {
      const user = await getLoggedInUser(ctx);
      return await this.updateProjectStatus(projectId, ProjStatus.can, user);
    } catch (error) {
      Logger.captureException(error);
      throw error;
      return false;
    }
  }

  @Mutation((returns) => Boolean)
  async activateProject(
    @Arg("projectId") projectId: number,
    @Ctx() ctx: MyContext
  ): Promise<Boolean> {
    try {
      const user = await getLoggedInUser(ctx);
      return await this.updateProjectStatus(projectId, ProjStatus.act, user);
    } catch (error) {
      Logger.captureException(error);
      throw error;
    }
  }
}
