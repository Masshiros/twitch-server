import { plainToInstance } from "class-transformer"
import { IsNotEmpty, IsOptional, validateSync } from "class-validator"

export class EnvironmentVariables {
  @IsOptional()
  APP_NAME?: string
  @IsOptional()
  APP_PORT?: number
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
  DATABASE_HOST: process.env.DATABASE_HOST,
  DATABASE_PORT: process.env.DATABASE_PORT,
  DATABASE_USERNAME: process.env.DATABASE_USERNAME,
  DATABASE_PASSWORD: process.env.DATABASE_PASSWORD,
  DATABASE_NAME: process.env.DATABASE_NAME,
  DATABASE_SCHEMA: process.env.DATABASE_SCHEMA,
}
export default config
