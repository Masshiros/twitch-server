import { EGroupPrivacy } from "src/module/groups/domain/enum/group-privacy.enum"
import { EGroupVisibility } from "src/module/groups/domain/enum/group-visibility.enum"
import { GroupPostResult } from "../common/group-post.result"
import { RuleResult } from "../common/rule.result"

export class GetGroupResult {
  id: string
  name: string
  description?: string | null
  coverImage?: string
  privacy: EGroupPrivacy
  visibility: EGroupVisibility
  isAdmin: boolean
  isMember: boolean
  rules?: RuleResult[] | null
  posts?: GroupPostResult[] | null
}
