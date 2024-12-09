-- DropForeignKey
ALTER TABLE "rolePermissions" DROP CONSTRAINT "rolePermissions_permissionId_fkey";

-- DropForeignKey
ALTER TABLE "rolePermissions" DROP CONSTRAINT "rolePermissions_roleId_fkey";

-- DropForeignKey
ALTER TABLE "userRoles" DROP CONSTRAINT "userRoles_roleId_fkey";

-- DropForeignKey
ALTER TABLE "userRoles" DROP CONSTRAINT "userRoles_userId_fkey";

-- AddForeignKey
ALTER TABLE "userRoles" ADD CONSTRAINT "userRoles_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "userRoles" ADD CONSTRAINT "userRoles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rolePermissions" ADD CONSTRAINT "rolePermissions_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "permissions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rolePermissions" ADD CONSTRAINT "rolePermissions_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
