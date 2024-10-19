type AssignRoleToUserCommandParams = {
  userId: string
  roleId: string[]
}
export class AssignRoleToUserCommand {
  userId: string
  roleId: string[]
  constructor(params: AssignRoleToUserCommandParams) {
    this.userId = params.userId
    this.roleId = params.roleId
  }
}
