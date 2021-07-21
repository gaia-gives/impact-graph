import { confirmNewMailPrefix } from './../constants/redisPrefixes';
import { Resolver, Mutation, Arg } from 'type-graphql'

import { redis } from '../redis'
import { User } from '../entities/user'
import { confirmUserPrefix } from '../constants/redisPrefixes'
import { InjectRepository } from 'typeorm-typedi-extensions';
import { Repository } from 'typeorm';

@Resolver()
export class ConfirmUserResolver {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  @Mutation(() => Boolean)
  async confirmUser (@Arg('token') token: string): Promise<boolean> {
    const prefixAndToken = confirmUserPrefix + token;
    const userId = await redis.get(prefixAndToken);
    await redis.del(prefixAndToken);

    if (!userId) {
      return false
    }
    const parsed = parseInt(userId, 10);
    await User.update({ id: parsed }, { confirmed: true })
    return true
  }

  @Mutation(() => Boolean)
  async confirmNewMail (@Arg('token') token: string): Promise<boolean> {
    const prefixAndToken = confirmNewMailPrefix + token;
    const userId = await redis.get(prefixAndToken);
    if (userId) {
      const parsed = parseInt(userId, 10);
      const user = await this.userRepository.findOne(userId);
      await redis.del(prefixAndToken);
      await User.update({ id: parsed }, { email: user?.newEmail, newEmail: undefined });
      return true
    } else {
      return false;
    }
  }
}
