import { EGroupPrivacy } from "src/module/groups/domain/enum/group-privacy.enum"
import { EGroupVisibility } from "src/module/groups/domain/enum/group-visibility.enum"

type CreateGroupCommandParams = {
  name: string
  privacy?: EGroupPrivacy
  visibility: EGroupVisibility
  friendIds?: string[]
  ownerId: string
}
export class CreateGroupCommand {
  name: string
  privacy: EGroupPrivacy
  visibility: EGroupVisibility
  friendIds?: string[]
  ownerId: string
  constructor(params: CreateGroupCommandParams) {
    this.name = params.name
    this.privacy = params.privacy
    this.visibility = params.visibility ?? EGroupVisibility.PUBLIC
    this.friendIds = params.friendIds ?? []
    this.ownerId = params.ownerId
  }
}
