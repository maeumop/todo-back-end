import { ApiProperty } from '@nestjs/swagger';
import { BaseResponse } from '../response.model';

export class JwtModel {
  idx: number;
  id: string;
  name: string;
  iat: number;
  exp: number;
}

export class LoginResponse extends BaseResponse {
  @ApiProperty()
  data: string;
}
