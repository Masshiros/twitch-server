type ToggleHidePostsFromUserCommandParams = {
  userId: string
  hiddenUserId: string
}
export class ToggleHidePostsFromUserCommand {
  userId: string
  hiddenUserId: string
  constructor(params: ToggleHidePostsFromUserCommandParams) {
    this.userId = params.userId
    this.hiddenUserId = params.hiddenUserId
  }
}
