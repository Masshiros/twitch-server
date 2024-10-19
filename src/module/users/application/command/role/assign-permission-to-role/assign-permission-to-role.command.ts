type AssignPermissionToRoleCommandParams = {
  roleId: string
  permissionsId: string[]
}
export class AssignPermissionToRoleCommand {
  roleId: string
  permissionsId: string[]
  constructor(params: AssignPermissionToRoleCommandParams) {
    this.roleId = params.roleId
    this.permissionsId = params.permissionsId
  }
}
