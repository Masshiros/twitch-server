import { PrismaClient } from "@prisma/client"
import { Permissions } from "../libs/constants/permissions"
import { Roles } from "../libs/constants/roles"
import { hashPassword } from "../utils/encrypt"

const prisma = new PrismaClient()

async function main() {
  console.log("Start seeding ...")

  const roleNames = Object.values(Roles)
  await prisma.role.createMany({
    data: roleNames.map((name) => ({ name })),
    skipDuplicates: true,
  })
  console.log(`Roles seeded: ${roleNames.join(", ")}`)

  const permissionResources = Object.values(Permissions)
  const permissionsToSeed = []

  for (const resource of permissionResources) {
    permissionsToSeed.push(...Object.values(resource))
  }

  await prisma.permission.createMany({
    data: permissionsToSeed.map((name) => ({
      name,
      description: `Permission for ${name.split(".")[1]}`,
    })),
    skipDuplicates: true,
  })
  console.log("Permissions seeded.")

  // 3. Assign permissions to roles
  const rolePermissionsMap = {
    [Roles.User]: [
      Permissions.Users.Read,
      Permissions.Followers.Read,
      Permissions.Categories.Read,
      Permissions.ExternalLinks.Update,
      Permissions.ExternalLinks.Read,
      Permissions.ExternalLinks.Delete,
      Permissions.ExternalLinks.Create,
    ],
    [Roles.Streamer]: [
      Permissions.Users.Read,
      Permissions.Followers.Read,
      Permissions.Categories.Read,
    ],
    [Roles.Admin]: permissionsToSeed,
    [Roles.ServerModerator]: [
      Permissions.Users.Read,
      Permissions.LoginHistories.Read,
      Permissions.Tokens.Read,
    ],
  }

  for (const [roleName, permissions] of Object.entries(rolePermissionsMap)) {
    const role = await prisma.role.findUnique({ where: { name: roleName } })

    if (!role) continue

    for (const permissionName of permissions) {
      const permission = await prisma.permission.findUnique({
        where: { name: permissionName },
      })

      if (permission) {
        await prisma.rolePermission.create({
          data: {
            roleId: role.id,
            permissionId: permission.id,
          },
        })
      }
    }
    console.log(`Permissions assigned to role: ${roleName}`)
  }

  // 4. Create the default admin user
  const defaultAdmin = await prisma.user.create({
    data: {
      name: "Admin User",
      displayName: "Admin",
      slug: "admin",
      email: "nguahoang2003@gmail.com",
      password: await hashPassword("strongPassword123@@AA"), // Replace with hashed password
      phoneNumber: "0123456789",
      dob: new Date("1980-01-01T00:00:00.000Z"), // ISO8601 format
    },
  })
  console.log(`Admin user created: ${defaultAdmin.email}`)

  // 5. Assign 'Admin' role to the default user
  const adminRole = await prisma.role.findUnique({
    where: { name: Roles.Admin },
  })

  if (adminRole) {
    await prisma.userRole.create({
      data: {
        userId: defaultAdmin.id,
        roleId: adminRole.id,
      },
    })
    console.log(`Role '${Roles.Admin}' assigned to user: ${defaultAdmin.email}`)
  }

  console.log("Seeding completed.")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => {
    prisma.$disconnect().then(() => console.log("Prisma disconnected."))
  })
