import { applyDecorators } from "@nestjs/common"
import {
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
  ApiUnprocessableEntityResponse,
} from "@nestjs/swagger"

interface ApiOperationDecoratorOptions {
  type?: any
  summary: string
  description: string
}
export function ApiOperationDecorator({
  type,
  summary,
  description,
}: ApiOperationDecoratorOptions) {
  return applyDecorators(
    ApiOperation({ summary }),
    ApiOkResponse({
      type,
      description,
    }),
    ApiUnauthorizedResponse({ description: "Token is invalid" }),
    ApiForbiddenResponse({ description: "Do not have permissions" }),
    ApiBadRequestResponse({ description: "Invalid data" }),
    ApiUnprocessableEntityResponse({ description: "Invalid data" }),
    ApiInternalServerErrorResponse({
      description: "Internal server error, please try later",
    }), // 500
  )
}
