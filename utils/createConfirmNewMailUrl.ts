import { confirmNewMailPrefix } from '../constants/redisPrefixes';
import { v4 } from 'uuid'
import { redis } from '../redis'
import config from '../config'

export const createConfirmNewMailUrl = async (userId: number) => {
  const token = v4()
  await redis.set(confirmNewMailPrefix + token, userId, 'ex', 60 * 60 * 72) // 3 day expiration

  return `${config.get('WEBSITE_URL')}/confirm-new-mail?token=${token}`
}
