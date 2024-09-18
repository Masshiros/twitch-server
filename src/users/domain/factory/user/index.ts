import { plainToInstance } from "class-transformer"
import { UserAggregate } from "../../aggregate"


export type CreateUserAggregateParams = {
  id?: string
  categoryId: string
  name: string
  slug: string
  password: string
  phoneNumber: string
  dob: Date
  emailVerified: boolean
  phoneVerified: boolean
  isLive: boolean
  view: number
  bio: string
  avatar: string
  thumbnail: string
}
export class UserFactory {
  createAggregate(params: CreateUserAggregateParams) {
    return plainToInstance(UserAggregate, { ...params })
  }
}
