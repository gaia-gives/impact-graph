import config from '../config'
import * as TypeORM from 'typeorm'
import { entities } from '../entities/entities'
import { seedDatabase } from '../helpers'
import * as TypeGraphQL from 'type-graphql'
import { resolvers } from '../resolvers/resolvers'
import { Container } from 'typedi'
import { userCheck } from '../auth/userCheck'
import { RegisterResolver } from '../user/register/RegisterResolver'
import { ConfirmUserResolver } from '../user/ConfirmUserResolver'
import { GraphQLSchema } from 'graphql'

const createSchema = async (): Promise<GraphQLSchema> => {
  TypeORM.useContainer(Container)

  if (config.get('REGISTER_USERNAME_PASSWORD') === 'true') {
    resolvers.push.apply(resolvers, [RegisterResolver, ConfirmUserResolver])
  }

  const dropSchema = config.get('DROP_DATABASE') === 'true'
  await TypeORM.createConnection({
    type: 'postgres',
    database: config.get('TYPEORM_DATABASE_NAME'),
    username: config.get('TYPEORM_DATABASE_USER'),
    password: config.get('TYPEORM_DATABASE_PASSWORD'),
    port: config.get('TYPEORM_DATABASE_PORT'),
    host: config.get('TYPEORM_DATABASE_HOST'),
    entities,
    synchronize: true,
    logger: 'advanced-console',
    logging: ['error'],
    dropSchema,
    cache: true
  })
  // James: removing for safety. We shouldn't need to do this again except on a local dev machine
  // const seedData = config.get('SEED_DATABASE') ? config.get('SEED_DATABASE') : false
  // if (seedData === 'true') {
  //     // seed database with some data
  //     // Removed for go live, in future this can be used to init the db with data, such as seed projects or categories
  //     const { defaultUser } = await seedDatabase()
  // }

  // build TypeGraphQL executable schema
  const schema = await TypeGraphQL.buildSchema({
    resolvers,
    container: Container,
    authChecker: userCheck
  })
  return schema
}

export default createSchema
