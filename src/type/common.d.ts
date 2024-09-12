import { HttpStatus } from '@nestjs/common';
import { MemberModel } from 'src/entity/member.entity';

type RequestWithMember = Request & { member: MemberModel };

interface ResponseModelType<T = undefined> {
  message?: string;
  statusCode?: HttpStatus;
  data?: T;
}
