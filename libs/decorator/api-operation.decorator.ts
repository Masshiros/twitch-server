import { applyDecorators } from "@nestjs/common"
import {
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiUnauthorizedResponse,
  ApiUnprocessableEntityResponse,
} from "@nestjs/swagger"

interface ApiOperationDecoratorOptions {
  type?: any
  summary: string
  description: string
  params?: { name: string; description: string; example?: any }[]
  queries?: { name: string; description: string; example?: any }[]
}
export function ApiOperationDecorator({
  type,
  summary,
  description,
  params,
  queries,
}: ApiOperationDecoratorOptions) {
  const decorators = [
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
    }),
  ]

  // Add @ApiParam if params are provided
  if (params) {
    params.forEach((param) => {
      decorators.push(
        ApiParam({
          name: param.name,
          description: param.description,
          example: param.example,
        }),
      )
    })
  }

  // Add @ApiQuery if queries are provided
  if (queries) {
    queries.forEach((query) => {
      decorators.push(
        ApiQuery({
          name: query.name,
          description: query.description,
          example: query.example,
        }),
      )
    })
  }

  return applyDecorators(...decorators)
}
