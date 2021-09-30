// tslint:disable-next-line:no-var-requires
import {Service} from "typedi";

const bcrypt = require('bcryptjs')
import { Resolver, Mutation, Arg } from 'type-graphql'
import { InjectRepository } from 'typeorm-typedi-extensions'
import { Organisation } from '../entities/organisation'

import { User } from '../entities/user'
import { RegisterInput } from '../user/register/RegisterInput'
import { sendEmail } from '../utils/sendEmail'
import { createConfirmationUrl } from '../utils/createConfirmationUrl'
import { Repository } from 'typeorm'
import config from '../config'

@Service()
@Resolver()
export class RegisterResolver {
  constructor (
    @InjectRepository(Organisation)
    private readonly organisationRepository: Repository<Organisation>
  ) {}

  @Mutation(() => User)
  async register (
    @Arg('data')
    { email, password, passwordClone, lastVisited }: RegisterInput
  ): Promise<User> {
    const hashedPassword = bcrypt.hashSync(password, 12)

    if(!await bcrypt.compare(passwordClone, hashedPassword)) {
      throw new Error("Password is not the same");
    }

    const user = await User.create({
      email,
      password: hashedPassword,
      loginType: 'password',
      confirmed: false
    }).save()
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
}
