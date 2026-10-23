import * as dotenv from 'dotenv';
import * as env from 'env-var';

dotenv.config();

export const envs = {
  AWS_REGION: env.get('AWS_REGION').default('us-east-2').asString(),
  AWS_S3_BUCKET: env.get('AWS_S3_BUCKET').asString(),
  PORT: env.get('PORT').default(3000).asPortNumber(),

  DB_HOST: env.get('DB_HOST').default('localhost').asString(),
  DB_PORT: env.get('DB_PORT').default(5432).asPortNumber(),
  DB_USERNAME: env.get('DB_USERNAME').required().asString(),
  DB_PASSWORD: env.get('DB_PASSWORD').required().asString(),
  DB_NAME: env.get('DB_NAME').required().asString(),

  MAILER_SERVICE: env.get('MAILER_SERVICE').asString(),
  MAILER_HOST: env.get('MAILER_HOST').default('smtp.gmail.com').asString(),
  MAILER_PORT: env.get('MAILER_PORT').default(587).asPortNumber(),
  MAILER_EMAIL: env.get('MAILER_EMAIL').asString(),
  MAILER_SECRET_KEY: env.get('MAILER_SECRET_KEY').asString(),
  MAINTENANCE_EMAIL: env.get('MAINTENANCE_EMAIL').asString(),
};
