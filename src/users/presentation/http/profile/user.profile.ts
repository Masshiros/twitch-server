import { createMap, type Mapper } from "@automapper/core"
import type { MappingProfile } from "@automapper/core"
import { AutomapperProfile, InjectMapper } from "@automapper/nestjs"
import { Injectable } from "@nestjs/common"
import { SignInCommand } from "src/users/application/command/auth/signin/signin.command"
import { SignupWithEmailCommand } from "src/users/application/command/auth/signup-with-email/signup-with-email.command"
import { SignupWithPhoneCommand } from "src/users/application/command/auth/signup-with-phone/signup-with-phone.command"
import { DeleteUserCommand } from "src/users/application/command/user/delete-user/delete-user.command"
import { UpdateBioCommand } from "src/users/application/command/user/update-bio/update-bio.command"
import { UpdateUsernameCommand } from "src/users/application/command/user/update-username/update-username.command"
import { SigninRequestDto } from "../dto/request/auth/signin.request.dto"
import { SignupWithEmailRequestDto } from "../dto/request/auth/signup-with-email.request.dto"
import { SignupWithPhoneRequestDto } from "../dto/request/auth/signup-with-phone.request.dto"
import { DeleteUserRequestDto } from "../dto/request/user/delete-user.request.dto"
import { UpdateBioRequestDto } from "../dto/request/user/update-bio.request.dto"
import { UpdateUsernameRequestDto } from "../dto/request/user/update-username.request.dto"

@Injectable()
export class UserProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper)
  }
  override get profile(): MappingProfile {
    return (mapper) => {
      createMap<SignupWithEmailRequestDto, SignupWithEmailCommand>(
        mapper,
        SignupWithEmailRequestDto,
        SignupWithEmailCommand,
      ).reverse()
      createMap<SignupWithPhoneRequestDto, SignupWithPhoneCommand>(
        mapper,
        SignupWithPhoneRequestDto,
        SignupWithPhoneCommand,
      ).reverse()
      createMap<DeleteUserRequestDto, DeleteUserCommand>(
        mapper,
        DeleteUserRequestDto,
        DeleteUserCommand,
      ).reverse()
      createMap<UpdateBioRequestDto, UpdateBioCommand>(
        mapper,
        UpdateBioRequestDto,
        UpdateBioCommand,
      ).reverse()
      createMap<UpdateUsernameRequestDto, UpdateUsernameCommand>(
        mapper,
        UpdateUsernameRequestDto,
        UpdateUsernameCommand,
      ).reverse()
      createMap<SigninRequestDto, SignInCommand>(
        mapper,
        SigninRequestDto,
        SignInCommand,
      ).reverse()
    }
  }
}
