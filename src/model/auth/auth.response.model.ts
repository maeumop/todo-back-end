import { ApiProperty } from '@nestjs/swagger';
import { BaseResponse } from '../response.model';

export class LoginResponse extends BaseResponse {
  @ApiProperty()
  data: string;
}
