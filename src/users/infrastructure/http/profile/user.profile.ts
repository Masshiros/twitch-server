import { AutomapperProfile } from '@automapper/nestjs';
import { createMap, Mapper } from '@automapper/core';
import type { MappingProfile } from '@automapper/core';
import { Injectable } from '@nestjs/common';
@Injectable()
export class UserProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }
  override get profile(): MappingProfile {
    return (mapper) => {};
  }
}
