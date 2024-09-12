import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Post,
  NotFoundException,
  Request,
  Patch,
  UseInterceptors,
  Body,
} from '@nestjs/common';
import { MemberService } from './member.service';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { MemberModel } from 'src/entity/member.entity';
import { RequestWithMember } from 'src/type/common';
import {
  ChangePasswordDto,
  MemberUpdateDto,
} from 'src/dto/member/member-update.dto';
import { BaseResponse, ResponseModel } from 'src/model/response.model';
import { GetMemberResponse } from 'src/model/member/member.response.model';

@Controller('member')
@ApiTags('MEMBER')
export class MemberController {
  constructor(private readonly memberSvc: MemberService) {}

  @Get()
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOperation({
    summary: '회원 정보 호출',
  })
  @ApiResponse({
    description: '회원 정보 호출 성공',
    type: GetMemberResponse,
  })
  async getMember(@Request() req: RequestWithMember) {
    const data = await this.memberSvc.member().byIdx(req.member.idx).user();

    if (!data) {
      throw new NotFoundException('없는 사용자 입니다.');
    }

    return ResponseModel.JSON<MemberModel>({ data });
  }

  @Patch()
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOperation({
    summary: '회원 정보 수정',
  })
  @ApiBody({
    type: MemberUpdateDto,
  })
  @ApiResponse({
    description: '회원 정보 변경 성공',
    type: BaseResponse,
  })
  async patchMember(
    @Body() dto: MemberUpdateDto,
    @Request() req: RequestWithMember,
  ) {
    await this.memberSvc.updateMember(req.member.idx, dto);

    return ResponseModel.JSON();
  }

  @Post('password')
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOperation({
    description: '회원 비밀번호 변경',
  })
  @ApiBody({
    type: ChangePasswordDto,
  })
  @ApiResponse({
    description: '회원 비밀번호 변경',
    type: BaseResponse,
  })
  async postPassword(
    @Body() dto: ChangePasswordDto,
    @Request() req: RequestWithMember,
  ) {
    await this.memberSvc.updateMember(req.member.idx, dto);

    return ResponseModel.JSON();
  }
}
