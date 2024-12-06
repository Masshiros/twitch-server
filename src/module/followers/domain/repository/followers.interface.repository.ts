import { Follower } from "../entity/followers.entity"

export abstract class IFollowersRepository {
  findFollowersByUser: (destinationUserId: string) => Promise<Follower[] | null>
  findFollowingByUser: (sourceUserId: string) => Promise<Follower[] | null>
  addFollower: (follower: Follower) => Promise<void>
  removeFollower: (follower: Follower) => Promise<void>
  isFollow: (
    destinationUserId: string,
    sourceUserId: string,
  ) => Promise<boolean>
}
