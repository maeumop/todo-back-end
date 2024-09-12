import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Post,
  Request,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthRegisterDto } from 'src/dto/auth/post-register.dto';
import { PublicApi } from 'src/decorator/public-api.decorator';
import { MemberModel } from 'src/entity/member.entity';
import { BasicTokenGuard } from 'src/guard/token.guard';
import { BaseResponse, ResponseModel } from 'src/model/response.model';
import { LoginResponse } from 'src/model/auth/auth.response.model';

@Controller('auth')
@ApiTags('AUTH')
export class AuthController {
  constructor(private readonly authSvc: AuthService) {}

  @Post('register')
  @PublicApi()
  @ApiOperation({
    summary: '회원 가입 (토큰 발급)',
  })
  @ApiBody({
    type: AuthRegisterDto,
  })
  @ApiResponse({
    description: '회원가입 성공',
    type: BaseResponse,
  })
  async register(@Body() dto: AuthRegisterDto) {
    const response = await this.authSvc.memberRegister(dto);

    return response;
  }

  @Post('login')
  @PublicApi()
  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(BasicTokenGuard)
  @ApiOperation({
    summary: '로그인 (토큰 발급)',
  })
  @ApiResponse({
    description: '로그인 완료',
    type: LoginResponse,
  })
  async login(@Request() req: Request & { member: MemberModel }) {
    const data = this.authSvc.signToken(req.member);

    return ResponseModel.JSON<string>({ data });
  }
}
