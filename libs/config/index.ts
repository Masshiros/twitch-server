import { plainToInstance } from "class-transformer"
import { IsNotEmpty, IsOptional, validateSync } from "class-validator"

export class EnvironmentVariables {
  @IsOptional()
  APP_NAME?: string
  @IsOptional()
  APP_PORT?: number
  @IsNotEmpty()
  HASH_SALT_LENGTH?: number
  @IsNotEmpty()
  DATABASE_HOST: string
  @IsNotEmpty()
  DATABASE_PORT: number
  @IsNotEmpty()
  DATABASE_USERNAME: string
  @IsNotEmpty()
  DATABASE_PASSWORD: string
  @IsNotEmpty()
  DATABASE_NAME: string
  @IsNotEmpty()
  DATABASE_SCHEMA: string
  @IsNotEmpty()
  NODEMAILER_EMAIL_SERVICE: string
  @IsNotEmpty()
  NODEMAILER_EMAIL_USER: string
  @IsNotEmpty()
  NODEMAILER_EMAIL_PASSWORD: string
  @IsNotEmpty()
  POSTMARK_SERVER_TOKEN: string
  @IsNotEmpty()
  TWILIO_ACCOUNT_SID: string
  @IsNotEmpty()
  TWILIO_AUTH_TOKEN: string
  @IsNotEmpty()
  TWILIO_VERIFICATION_SERVICE_SID: string
}
export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  })
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  })
  if (errors.length > 0) {
    throw new Error(errors.toString())
  }
  return validatedConfig
}
const config = {
  APP_NAME: process.env.APP_NAME || "booking-service",
  APP_PORT: +process.env.APP_PORT || 3000,
  HASH_SALT_LENGTH: +process.env.HASH_SALT_LENGTH || 10,
  DATABASE_HOST: process.env.DATABASE_HOST,
  DATABASE_PORT: process.env.DATABASE_PORT,
  DATABASE_USERNAME: process.env.DATABASE_USERNAME,
  DATABASE_PASSWORD: process.env.DATABASE_PASSWORD,
  DATABASE_NAME: process.env.DATABASE_NAME,
  DATABASE_SCHEMA: process.env.DATABASE_SCHEMA,
  NODEMAILER_EMAIL_SERVICE: process.env.NODEMAILER_EMAIL_SERVICE,
  NODEMAILER_EMAIL_USER: process.env.NODEMAILER_EMAIL_USER,
  NODEMAILER_EMAIL_PASSWORD: process.env.NODEMAILER_EMAIL_PASSWORD,
  POSTMARK_SERVER_TOKEN: process.env.POSTMARK_SERVER_TOKEN,
  TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID,
  TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN,
  TWILIO_VERIFICATION_SERVICE_SID: process.env.TWILIO_VERIFICATION_SERVICE_SID,
}
export default config
