import config from "../config";
import * as TypeORM from "typeorm";
import * as TypeGraphQL from "type-graphql";
import entities from "../entities";
import resolvers from "../resolvers";
import { Container } from "typedi";
import { userCheck } from "../auth/userCheck";
import { GraphQLSchema } from "graphql";

const createSchema = async (): Promise<GraphQLSchema> => {
  TypeORM.useContainer(Container);

  await TypeORM.createConnection({
    type: "postgres",
    database: config.get("TYPEORM_DATABASE_NAME"),
    username: config.get("TYPEORM_DATABASE_USER"),
    password: config.get("TYPEORM_DATABASE_PASSWORD"),
    port: config.get("TYPEORM_DATABASE_PORT"),
    host: config.get("TYPEORM_DATABASE_HOST"),
    entities: entities,
    synchronize: true,
    logger: "advanced-console",
    logging: ["error"],
    dropSchema: false,
    cache: true,
  });

  const schema = await TypeGraphQL.buildSchema({
    resolvers,
    container: Container,
    authChecker: userCheck,
  });
  return schema;
};

export default createSchema;
