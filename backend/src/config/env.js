require("dotenv").config();
const Joi = require("joi");

const envSchema = Joi.object({
  PORT: Joi.number().default(5000),
  NODE_ENV: Joi.string().valid("development", "production", "test").default("development"),
  DATABASE_URL: Joi.string().required().description("PostgreSQL connection string"),
  JWT_SECRET: Joi.string().required().description("JWT Secret Key"),
  JWT_EXPIRES_IN: Joi.string().default("1d"),
  CORS_ORIGIN: Joi.string().default("http://localhost:5173"),
  ENABLE_CRON: Joi.boolean().default(true),
}).unknown();

const { error, value: envVars } = envSchema.validate(process.env);

if (error) {
  console.error(`Config validation error: ${error.message}`);
  process.exit(1);
}

const env = {
  port: envVars.PORT,
  nodeEnv: envVars.NODE_ENV,
  databaseUrl: envVars.DATABASE_URL,
  jwtSecret: envVars.JWT_SECRET,
  jwtExpiresIn: envVars.JWT_EXPIRES_IN,
  corsOrigin: envVars.CORS_ORIGIN,
  enableCron: envVars.ENABLE_CRON
};

module.exports = { env };
