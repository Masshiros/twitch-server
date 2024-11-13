import { GroupResult } from "../common/group.result"

export class GetJoinedGroupResult {
  groups: {
    info: GroupResult
    joinedAt: Date
  }[]
}
