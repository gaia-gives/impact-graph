import { Resolver, Mutation, Arg } from 'type-graphql'

import { redis } from '../redis'
import { User } from '../entities/user'
import { confirmUserPrefix } from '../constants/redisPrefixes'

@Resolver()
export class ConfirmUserResolver {
  @Mutation(() => Boolean)
  async confirmUser (@Arg('token') token: string): Promise<boolean> {
    const prefixAndToken = confirmUserPrefix + token;
    const userId = await redis.get(prefixAndToken)
    await redis.del(prefixAndToken)

    if (!userId) {
      return false
    }
    await User.update({ id: parseInt(userId, 10) }, { confirmed: true })

    return true
  }
}
