import {
  Resolver,
  Query,
  Arg,
  Mutation,
  Ctx,
  Int
} from 'type-graphql'
import { InjectRepository } from 'typeorm-typedi-extensions'
import { Repository } from 'typeorm'
import { User } from '../entities/user'
import { RegisterInput } from '../user/register/RegisterInput'
import { Organisation } from '../entities/organisation'
import { MyContext } from '../types/MyContext'
import { getAnalytics } from '../analytics'
import * as bcrypt from "bcryptjs";
import { ERROR_CODES } from '../utils/errorCodes'

const analytics = getAnalytics()

@Resolver(of => User)
export class UserResolver {
  constructor (
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Organisation)
    private readonly organisationRepository: Repository<Organisation> // , // @InjectRepository(OrganisationUser) // private readonly organisationUserRepository: Repository<OrganisationUser>
  ) {}

  async create (@Arg('data', () => RegisterInput) data: any) {
    // return User.create(data).save();
  }

  @Query(returns => User, { nullable: true })
  async user (@Arg('userId', type => Int) userId: number) {
    const user = await this.userRepository.findOne(userId)
    return user
  }

  @Query(returns => User, { nullable: true })
  userByAddress (@Arg('address', type => String) address: string) {
    return this.userRepository.findOne({ walletAddress: address })
  }

  @Mutation(returns => Boolean)
  async updateUser (
    @Arg('firstName', { nullable: true }) firstName: string,
    @Arg('lastName', { nullable: true }) lastName: string,
    @Arg('location', { nullable: true }) location: string,
    @Arg('email', { nullable: true }) email: string,
    @Arg('name', { nullable: true }) name: string,
    @Arg('url', { nullable: true }) url: string,
    @Arg('password', { nullable: true }) password: string,
    @Ctx() { req: { user } }: MyContext
  ): Promise<boolean> {
    if (!user) throw new Error(ERROR_CODES.AUTHENTICATION_REQUIRED);
    let dbUser = await User.findOne({ id: user.userId }, { select: ["password"] });

    const authorizedToEdit = await bcrypt.compare(password, dbUser?.password ?? '');
    if (!authorizedToEdit) throw new Error(ERROR_CODES.UNAUTHORIZED);

    if (dbUser && authorizedToEdit) {
      let fullName: string = ''
      if (!name) {
        fullName = firstName + ' ' + lastName
      }
      await User.update(
        { id: user.userId },
        { firstName, lastName, name: fullName, location, email, url }
      )
      const idUser = dbUser
      idUser.firstName = firstName
      idUser.lastName = lastName
      idUser.name = fullName
      idUser.location = location
      idUser.email = email
      idUser.url = url

      const segmentUpdateProfile = {
        firstName : idUser.firstName,
        lastName : idUser.lastName,
        location : idUser.location,
        email : idUser.email,
        url : idUser.url,
      }

      analytics.identifyUser(idUser)
      analytics.track('Updated profile',  dbUser.segmentUserId(), segmentUpdateProfile, null)

      return true
    } else {
      return false
    }
  }
}
