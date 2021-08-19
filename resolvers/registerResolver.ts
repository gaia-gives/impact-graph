// tslint:disable-next-line:no-var-requires
const bcrypt = require('bcryptjs')
import { Resolver, Mutation, Arg } from 'type-graphql'
import { InjectRepository } from 'typeorm-typedi-extensions'
import { Organisation } from '../entities/organisation'
import { OrganisationUser } from '../entities/organisationUser'

import { User } from '../entities/user'
import { RegisterWalletInput } from '../user/register/RegisterWalletInput'
import { RegisterInput } from '../user/register/RegisterInput'
import { sendEmail } from '../utils/sendEmail'
import { createConfirmationUrl } from '../utils/createConfirmationUrl'
import { Repository } from 'typeorm'
import config from '../config'

@Resolver()
export class RegisterResolver {
  constructor (
    @InjectRepository(OrganisationUser)
    private readonly organisationUserRepository: Repository<OrganisationUser>,

    @InjectRepository(Organisation)
    private readonly organisationRepository: Repository<Organisation>
  ) {}

  @Mutation(() => User)
  async register (
    @Arg('data')
    { email, password, passwordClone, lastVisited }: RegisterInput
  ): Promise<User> {
    console.log(`In Register Resolver : ${JSON.stringify(bcrypt, null, 2)}`)

    // const hashedPassword = await bcrypt.hash(password, 12)
    const hashedPassword = bcrypt.hashSync(password, 12)
    console.log(`hashedPassword ---> : ${hashedPassword}`)

    if(!await bcrypt.compare(passwordClone, hashedPassword)) {
      throw new Error("Password is not the same");
    }

    const user = await User.create({
      email,
      password: hashedPassword,
      loginType: 'password',
      confirmed: false
    }).save()
    console.log("after creation")
    const confirmationUrl = await createConfirmationUrl(user.id, lastVisited);
    await sendEmail({
      to: email,
      from: config.get("GAIA_EMAIL_FROM"),
      subject: "Gaia Gives Account Confirmation",
      html: `Your account confirmation url: <a href="${confirmationUrl}">${confirmationUrl}</a>`
    }); 

    delete user.password
    return user
  }

  @Mutation(() => User)
  async registerWallet (
    @Arg('data')
    {
      email,
      name,
      firstName,
      lastName,
      walletAddress,
      organisationId
    }: RegisterWalletInput
  ): Promise<User> {
    const user = await User.create({
      firstName,
      lastName,
      email,
      name,
      walletAddress,
      loginType: 'wallet'
    })

    if (organisationId) {
      const organisation = await this.organisationRepository.find({
        where: { id: organisationId }
      })

      if (organisation) {
        user.organisations = [organisation[0]]
        const organisationUser = new OrganisationUser()
        organisationUser.role = 'donor'
        user.organisationUsers = [organisationUser]
        // TODO: The above isn't saving the role, but we don't need it right now #8 https://github.com/topiahq/impact-graph/issues/8

        user.save()
      } else {
        throw new Error('Organisation doesnt exist')
      }
    } else {
      throw new Error('User must be associated with an Organisation!')
    }

    if (email) {
      // await sendEmail(email, await createConfirmationUrl(user.id))
    }

    return user
  }
}
