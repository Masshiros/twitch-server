import { UserResult } from "../common/user.result"

export class GetMembersResult {
  numberOfAdminsInGroup: number
  admins: UserResult[]
  numberOfFriendsInGroup: number
  friends: UserResult[]
}
