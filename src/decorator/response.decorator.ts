import { applyDecorators, HttpStatus, Type } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';

export const ApiResponse = <T extends Type<unknown>>(
  data: T,
  description: string,
) =>
  applyDecorators(
    ApiExtraModels(data),
    ApiOkResponse({
      description,
      schema: {
        allOf: [
          {
            properties: {
              message: {
                type: 'string',
              },
              statusCode: {
                type: 'number',
                default: HttpStatus.OK,
              },
              data: {
                $ref: getSchemaPath(data),
              },
            },
          },
        ],
      },
    }),
  );
