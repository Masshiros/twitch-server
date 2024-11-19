export interface LiveStreamInfoResult {
  id: string
  userId: string
  userName: string
  userSlug: string
  title: string
  isLive: boolean
  totalView: number
  livestreamCategorieNames: string[]
  livestreamTagsNames: string[]
}

export class GetLiveStreamResults {
  liveStreams: LiveStreamInfoResult[]
}
