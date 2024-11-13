import { GroupResult } from "../common/group.result"

export class GetManageGroupResult {
  groups: {
    info: GroupResult
    createdAt: string
  }[]
}
