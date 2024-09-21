import { createMap, type Mapper } from "@automapper/core"
import type { MappingProfile } from "@automapper/core"
import { AutomapperProfile, InjectMapper } from "@automapper/nestjs"
import { Injectable } from "@nestjs/common"
import { SignupWithEmailCommand } from "src/users/application/command/user/signup-with-email/signup-with-email.command"
import { SignupWithPhoneCommand } from "src/users/application/command/user/signup-with-phone/signup-with-phone.command"
import { SignupWithEmailDto } from "../dto/request/signup-with-email.dto"
import { SignupWithPhoneDto } from "../dto/request/signup-with-phone.dto"

@Injectable()
export class UserProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper)
  }
  override get profile(): MappingProfile {
    return (mapper) => {
      createMap<SignupWithEmailDto, SignupWithEmailCommand>(
        mapper,
        SignupWithEmailDto,
        SignupWithEmailCommand,
      ).reverse()
      createMap<SignupWithPhoneDto, SignupWithPhoneCommand>(
        mapper,
        SignupWithPhoneDto,
        SignupWithPhoneCommand,
      ).reverse()
    }
  }
}
