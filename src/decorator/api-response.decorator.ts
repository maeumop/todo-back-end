import { applyDecorators, Type } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';

export const ApiBaseResponse = <T extends Type<unknown>>(
  description: string,
  data?: T,
) => {
  // let data;

  // if (typeof data === 'string' || typeof data === 'number') {
  //   properties.data = {
  //     type: typeof data,
  //   };
  // } else if (typeof data === 'object') {
  //   properties.data = {
  //     $ref: getSchemaPath(data),
  //   };
  // } else if (Array.isArray(data)) {
  //   properties.data = {
  //     type: 'array',
  //     items: {
  //       $ref: getSchemaPath(data[0]),
  //     },
  //   };
  // }

  return applyDecorators(
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
              },
              // data: {
              //   $ref: getSchemaPath(data),
              // },
            },
          },
        ],
      },
    }),
  );
};
