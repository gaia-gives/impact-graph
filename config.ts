import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({
  path: path.resolve(__dirname, `./config/${process.env.NODE_ENV || ""}.env`),
});
const envVars = [
  "JWT_SECRET",
  "JWT_MAX_AGE",
  "TYPEORM_DATABASE_TYPE",
  "TYPEORM_DATABASE_NAME",
  "TYPEORM_DATABASE_USER",
  "TYPEORM_DATABASE_PASSWORD",
  "TYPEORM_DATABASE_HOST",
  "TYPEORM_DATABASE_PORT",
  "TYPEORM_LOGGING",
  "DROP_DATABASE",
  "SEED_PASSWORD",
  "APOLLO_KEY",
  "REGISTER_USERNAME_PASSWORD",
  "STRIPE_KEY",
  "STRIPE_SECRET",
  "STRIPE_APPLICATION_FEE",
  "STRIPE_WEBHOOK_SECRET",
  "PINATA_API_KEY",
  "PINATA_SECRET_API_KEY",
  "SEED_DATABASE",
  "SERVER_ADMIN_EMAIL",
  "DEFAULT_ORGANISATION",
  "UPLOAD_FILE_MAX_SIZE",
  "ETHEREUM_NODE_ID",
  "ETHEREUM_NETWORK",
  "HOSTNAME_WHITELIST",
  "SENTRY_ID",
  "SENTRY_TOKEN",
  "NETLIFY_DEPLOY_HOOK",
  "ENVIRONMENT",
  "WEBSITE_URL",
  "TRIGGER_BUILD_ON_NEW_PROJECT",
  "ETHEREUM_NETWORK_ID",
  "OUR_SECRET",
  "XDAI_NODE_HTTP_URL",
  "SEGMENT_API_KEY",
  "MAIL_HOST",
  "MAIL_HOST",
  "MAIL_PORT",
  "MAIL_USER",
  "MAIL_PASS",
  "PASSWORD_RESET_TOKEN_LIFETIME_SECONDS",
  "COOKIE_SECRET",
  "COOKIE_SECURE"
];
interface requiredEnv {
  JWT_SECRET: string;
  JWT_MAX_AGE: string;
  ETHEREUM_NODE_ID: string;
  ETHEREUM_NETWORK: string;
  TYPEORM_DATABASE_TYPE: string;
  TYPEORM_DATABASE_NAME: string;
  TYPEORM_DATABASE_USER: string;
  TYPEORM_DATABASE_PASSWORD: string;
  TYPEORM_DATABASE_HOST: string;
  TYPEORM_DATABASE_PORT: number;
  TYPEORM_LOGGING: string;
  REDIS_HOST: string;
  REDIS_PORT: number;
  DROP_DATABASE: string;
  SEED_PASSWORD: string;
  APOLLO_KEY: string;
  REGISTER_USERNAME_PASSWORD: string;

  STRIPE_KEY: string;
  STRIPE_SECRET: string;
  STRIPE_APPLICATION_FEE: number;
  STRIPE_WEBHOOK_SECRET: string;

  PINATA_API_KEY: string;
  PINATA_SECRET_API_KEY: string;
  UPLOAD_FILE_MAX_SIZE: number;
  HOSTNAME_WHITELIST: string; // Comma separated
  SENTRY_ID: string;
  SENTRY_TOKEN: string;
  NETLIFY_DEPLOY_HOOK: string;
  DEFAULT_ORGANISATION: string;
  ENVIRONMENT: string;
  WEBSITE_URL: string;
  TRIGGER_BUILD_ON_NEW_PROJECT: string;
  ETHEREUM_NETWORK_ID: string;
  OUR_SECRET: string;
  XDAI_NODE_HTTP_URL: string;
  SEGMENT_API_KEY: string;
  SERVER_ADMIN_EMAIL: string;
  XDAI_NODE_WS_URL: string;
  BSC_NODE_WS_URL: string;
  BSC_NODE_HTTP_URL: string;
  MAIL_HOST: string;
  MAIL_PORT: number;
  MAIL_USER: string;
  MAIL_PASS: string;
  PASSWORD_RESET_TOKEN_LIFETIME_SECONDS: number;
  COOKIE_SECRET: string;
  ACCESS_TOKEN_LIFETIME_IN_DAYS: number;
  COOKIE_SECURE: string;
}

class Config {
  env: requiredEnv;

  constructor(envFile: any) {
    this.env = envFile;
    this.validateEnv(envFile);
  }

  //Have this - replace it!
  validateEnv(envFile) {
    envVars.forEach((envVar) => {
      if (envFile[envVar]) {
        this[envVar] = envFile[envVar];
        // console.log(`envVar ---> : ${this[envVar]}`)
      } else {
        throw new Error(`Need to provide a ${envVar} in the .env`);
      }
    });
  }

  public get<K extends keyof requiredEnv>(envVar: K): requiredEnv[K] {
    if (!this.env[envVar]) {
      throw new Error(`${envVar} is an invalid env variable`);
    }
    return this.env[envVar];
  }
}

const config = new Config(process.env);

export default config;
