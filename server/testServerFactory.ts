import config from "../config";
import { ApolloServer } from "apollo-server-express";
import * as TypeGraphQL from "type-graphql";
import * as TypeORM from "typeorm";
import { ApolloServerPluginUsageReportingDisabled } from "apollo-server-core";
import Container from "typedi";
import entities from "../entities";
import resolvers from "../resolvers";
import { userCheck } from "../auth/userCheck";
import fs from "fs/promises";
import path from "path";

const createTestSchema = () =>
  TypeGraphQL.buildSchema({
    resolvers,
    container: Container,
    authChecker: userCheck,
  });

const createTestConnection = async () => {
  TypeORM.useContainer(Container);
  return await TypeORM.createConnection({
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
    dropSchema: true,
  });
};

const seedDatabase = async (connection: TypeORM.Connection) => {
  const filePath = path.join(__dirname, "..", "data/seed.sql")
  const data = await fs.readFile(filePath);
  const sql = data.toString("utf-8");
  return await connection.query(sql);
};

const createTestServer: () => Promise<[TypeORM.Connection, ApolloServer]> =
  async () => {
    const connection = await createTestConnection();
    const schema = await createTestSchema();

    const server = new ApolloServer({
      schema,
      context: ({ req = {}, res = {} }: any) => {
        req.user = {
          email: "test@testmail.com",
          name: "john-doe",
          userId: 1,
        };
        req.userwalletAddress = "0xAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA";

        return {
          req,
          res,
        };
      },
      playground: {
        endpoint: "/graphql",
      },
      uploads: {
        maxFileSize: config.get("UPLOAD_FILE_MAX_SIZE") || 2000000,
      },
      plugins: [ApolloServerPluginUsageReportingDisabled()],
    });

    await seedDatabase(connection);
    return [connection, server];
  };

export { createTestServer };
