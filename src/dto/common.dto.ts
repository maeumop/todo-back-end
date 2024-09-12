import { Type } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export class BaseResponseDto<T = Type<unknown>> {
  @ApiProperty()
  message: string;

  @ApiProperty()
  statusCode: number;

  @ApiProperty()
  data?: T;
}
