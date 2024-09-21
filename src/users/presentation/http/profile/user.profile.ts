import { createMap, Mapper } from "@automapper/core"
import type { MappingProfile } from "@automapper/core"
import { AutomapperProfile, InjectMapper } from "@automapper/nestjs"
import { Injectable } from "@nestjs/common"
import { UserAggregate } from "src/users/domain/aggregate"
import { SignupWithEmailDto } from "../dto/request/signup-with-email.dto"

@Injectable()
export class UserProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper)
  }
  override get profile(): MappingProfile {
    return (mapper) => {
      createMap<SignupWithEmailDto, UserAggregate>(
        mapper,
        SignupWithEmailDto,
        UserAggregate,
      )
    }
  }
}
