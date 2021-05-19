import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const { env } = process;

dotenv.config({
  path: join(__dirname, '../.env')
});

export const config = {
  PORT: env.PORT,
  DB_NAME: env.DB_NAME,
  DB_USERNAME: env.DB_USERNAME,
  DB_PASSWORD: env.DB_PASSWORD,
  DB_HOST: env.DB_HOST,
  DB_PORT: env.DB_PORT,
  JWT_SECRET: env.JWT_SECRET,
};
