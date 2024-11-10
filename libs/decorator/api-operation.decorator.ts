import { isArray } from "util"
import { applyDecorators } from "@nestjs/common"
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
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
  listBadRequestErrorMessages?: string[]
  listNotFoundErrorMessages?: string[]
  auth?: boolean
  fileFieldName?: string
  isArrayOfFile?: boolean
}
export function ApiOperationDecorator({
  type,
  summary,
  description,
  params,
  queries,
  auth = false,
  listBadRequestErrorMessages,
  listNotFoundErrorMessages,
  fileFieldName,
}: ApiOperationDecoratorOptions) {
  const decorators = [
    ApiOperation({ summary }),
    ApiOkResponse({
      type,
      description,
    }),
    ApiUnauthorizedResponse({ description: "Token is invalid" }),
    ApiForbiddenResponse({ description: "Do not have permissions" }),
    ApiBadRequestResponse({
      description: "Domain error",
      schema: {
        type: "object",
        properties: {
          message: {
            type: "string",
            example: listBadRequestErrorMessages,
          },
        },
      },
    }),
    ApiNotFoundResponse({
      description: "Domain not found data",
      schema: {
        type: "object",
        properties: {
          message: {
            type: "string",
            example: listNotFoundErrorMessages,
          },
        },
      },
    }),
    ApiUnprocessableEntityResponse({ description: "Invalid data" }),
    ApiInternalServerErrorResponse({
      description: "Internal server error, please try later",
    }),
  ]
  if (auth) {
    decorators.push(ApiBearerAuth()) // This adds the Bearer Token to the Swagger UI
  }

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
  if (fileFieldName) {
    decorators.push(ApiConsumes("multipart/form-data"))
  }
  return applyDecorators(...decorators)
}
