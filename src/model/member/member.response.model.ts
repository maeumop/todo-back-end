import { ApiProperty } from '@nestjs/swagger';
import { BaseResponse } from '../response.model';
import { MemberModel } from 'src/entity/member.entity';

export class GetMemberResponse extends BaseResponse {
  @ApiProperty()
  data: MemberModel;
}
