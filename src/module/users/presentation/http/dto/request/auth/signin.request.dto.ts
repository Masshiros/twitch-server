import { ApiProperty } from "@nestjs/swagger"
import { IsIP, IsNotEmpty, IsString } from "class-validator"

export class SigninRequestDto {
  @ApiProperty({
    description: "The username of the user",
    example: "john_doe",
  })
  @IsString()
  @IsNotEmpty()
  readonly username: string

  @ApiProperty({
    description: "The password of the user",
    example: "strong_password",
  })
  @IsString()
  @IsNotEmpty()
  readonly password: string
  @ApiProperty({
    description: "The device name used for signing in",
    example: "iPhone 13",
  })
  @IsString()
  @IsNotEmpty()
  readonly deviceName: string

  @ApiProperty({
    description: "The user agent string of the browser or device",
    example: "Mozilla/5.0 (iPhone; CPU iPhone OS 15_2 like Mac OS X)",
  })
  @IsString()
  @IsNotEmpty()
  readonly userAgent: string

  @ApiProperty({
    description: "The IP address of the user",
    example: "192.168.1.1",
  })
  @IsIP()
  @IsNotEmpty()
  readonly ipAddress: string

  @ApiProperty({
    description: "The type of device used for signing in",
    example: "MOBILE",
  })
  @IsString()
  @IsNotEmpty()
  readonly deviceType: string
}
