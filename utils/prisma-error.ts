import { Prisma } from "@prisma/client"
import {
  InfrastructureError,
  InfrastructureErrorCode,
} from "libs/exception/infrastructure"

export function handlePrismaError(
  error: Prisma.PrismaClientKnownRequestError,
): never {
  switch (error.code) {
    case "P2002": // Unique constraint failed
      throw new InfrastructureError({
        code: InfrastructureErrorCode.BAD_REQUEST,
        message: "Duplicate entry found for a unique field",
      })

    case "P2003": // Foreign key constraint failed
      throw new InfrastructureError({
        code: InfrastructureErrorCode.BAD_REQUEST,
        message: "Invalid foreign key reference",
      })

    case "P2023": // Invalid date-time format
      throw new InfrastructureError({
        code: InfrastructureErrorCode.BAD_REQUEST,
        message: "Invalid date-time format",
      })

    case "P2000": // Value too long for the column
      throw new InfrastructureError({
        code: InfrastructureErrorCode.BAD_REQUEST,
        message: "Value is too long for this field",
      })

    // Add more cases for different Prisma errors
    default:
      throw new InfrastructureError({
        code: InfrastructureErrorCode.INTERNAL_SERVER_ERROR,
        message: "An unexpected error occurred",
      })
  }
}
