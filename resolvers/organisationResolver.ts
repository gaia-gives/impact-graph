import { InjectRepository } from 'typeorm-typedi-extensions'

import {
  Resolver,
  FieldResolver,
  Root,
  Ctx,
  Query,
  Arg
} from 'type-graphql'

import { Organisation } from '../entities/organisation'
import { OrganisationUser } from '../entities/organisationUser'
import { User } from '../entities/user'
import { Project } from '../entities/project'
import { Repository } from 'typeorm'
import { MyContext } from '../types/MyContext'
import { Service } from 'typedi'

@Service()
@Resolver(of => Organisation)
export class OrganisationResolver {
  constructor (
    @InjectRepository(Organisation)
    private readonly organisationRepository: Repository<Organisation>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,

    @InjectRepository(OrganisationUser)
    private readonly organisationUserRepository: Repository<OrganisationUser>
  ) {}

  @FieldResolver()
  async projects (@Root() organisation: Organisation) {
  }

  @Query(returns => [Project])
  async organisationProjects (
    @Arg('organisationId') organisationId: number,
    @Ctx() ctx: MyContext
  ): Promise<Project[]> {
    console.log(`organisationId ---> : ${organisationId}`)

    if (!ctx.req.user) {
      console.log(`access denied : ${JSON.stringify(ctx.req.user, null, 2)}`)
      throw new Error('Access denied')
      // return undefined
    }
    const organisations = await this.organisationRepository.find({
      relations: ['projects'],
      where: { id: organisationId }
    })

    console.log(
      `organisations ---> : ${JSON.stringify(
        organisations[0].projects,
        null,
        2
      )}`
    )

    return organisations[0].projects
  }

  @Query(returns => Organisation)
  async organisationById (
    @Arg('organisationId', ) organisationId: number
  ): Promise<Organisation> {
    console.log(`organisationId ---> : ${organisationId}`)

    const organisation = await this.organisationRepository.find({
      relations: ['projects'],
      where: { id: organisationId }
    });

    return organisation[0];
  }

  @Query(returns => [Organisation])
  organisations (): Promise<Organisation[]> {
    return this.organisationRepository.find();
  }
}
