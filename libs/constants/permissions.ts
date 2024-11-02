export class Permissions {
  public static Users = createPermissions("Users")
  public static Devices = createPermissions("Devices")
  public static ExternalLinks = createPermissions("ExternalLinks")
  public static LoginHistories = createPermissions("LoginHistories")
  public static Tokens = createPermissions("Tokens")
  public static Categories = createPermissions("Categories")
  public static Tags = createPermissions("Tags")
  public static Followers = createPermissions("Followers")
  public static Roles = createPermissions("Roles")
  public static Permissions = createPermissions("Permissions")
  public static Posts = createPermissions("Posts")
  public static Reactions = createPermissions("Reactions")
}

function createPermissions(resource: string) {
  return {
    Create: `Permissions.${resource}.Create`,
    Read: `Permissions.${resource}.Read`,
    Update: `Permissions.${resource}.Update`,
    Delete: `Permissions.${resource}.Delete`,
  }
}
