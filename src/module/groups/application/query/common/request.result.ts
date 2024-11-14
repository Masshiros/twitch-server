import { UserResult } from "./user.result"

export class RequestResult {
  user: UserResult
  numberOfFriends: number
  numberOfMutualFriends: number
  mutualFriendNames: string[]
  numberOfFriendsInGroup: number
  friendNamesInGroup: string[]
  numberOfGroupsInCommon: number
  groupsInCommonName: string[]
  createdAt: string
}
