import { MemberService } from './../member/member.service';
import {
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthRegisterDto } from 'src/dto/auth/post-register.dto';
import { MemberModel } from 'src/entity/member.entity';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { sha512 } from 'js-sha512';
import { ResponseModel } from 'src/model/response.model';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(MemberModel)
    private readonly repository: Repository<MemberModel>,
    private readonly memberSvc: MemberService,
    private readonly jwtSvc: JwtService,
    private readonly configSvc: ConfigService,
  ) {}

  /**
   * 회원 가입
   * @param dto
   * @returns
   */
  async memberRegister(dto: AuthRegisterDto) {
    // 중복 확인
    if (await this.memberSvc.member().byId(dto.userId).exists()) {
      return ResponseModel.JSON({
        message: '이미 가입된 회원',
        statusCode: HttpStatus.PRECONDITION_FAILED, // 412 error
      });
    }

    const sha512Key = this.configSvc.get('SHA512_KEY');
    const pwd = sha512.hmac(sha512Key, dto.pwd);

    const member = await this.repository.save({
      ...dto,
      pwd,
    });

    if (!member) {
      throw new InternalServerErrorException('회원 가입 실패!');
    }

    const token = this.signToken(member);

    return ResponseModel.JSON({ data: token });
  }

  /**
   * 원본 토큰에서 토큰 형식과 토큰 값을 분리
   * @param rawToken
   * @param isBasic
   * @returns
   */
  getOnlyToken(rawToken: string, isBasic: boolean = false) {
    const needType = isBasic ? 'Basic' : 'Bearer';

    const [type, token] = rawToken.split(' ');

    if (type !== needType || !token) {
      throw new UnauthorizedException(
        `토큰정보가 올바르지 않습니다. [${needType}]`,
      );
    }

    return token;
  }

  /**
   * basic token decode
   * @param base64
   * @returns
   */
  decodeBasicToken(base64: string) {
    const [userId, pwd] = Buffer.from(base64, 'base64')
      .toString('utf-8')
      .split(':');

    if (!userId || !pwd) {
      throw new UnauthorizedException('Basic token 정보 오류');
    }

    return { userId, pwd };
  }

  /**
   * 토큰 검수
   * @param token
   * @returns
   */
  verifyToken(token: string) {
    const secret = this.configSvc.get('JWT_SECRET');

    try {
      return this.jwtSvc.verify(token, { secret });
    } catch (e) {
      throw new UnauthorizedException(
        '토큰이 만료되었거나, 잘못된 토큰입니다.',
      );
    }
  }

  /**
   * 토큰 재발급
   * @param token
   * @param isRefresh
   * @returns
   */
  // reissueToken(token: string, isRefresh: boolean = false) {
  //   const decode = this.verifyToken(token);

  //   if (decode.type !== 'refresh') {
  //     throw new UnauthorizedException('재발급이 불가능한 토큰입니다.');
  //   }

  //   return this.signToken(decode, isRefresh);
  // }

  /**
   * 10시간 유지되는 토큰 발급
   * @param member
   * @returns
   */
  signToken(member: Pick<MemberModel, 'idx' | 'userId' | 'userName'>) {
    const secret = this.configSvc.get('JWT_SECRET');

    return this.jwtSvc.sign(
      {
        idx: member.idx,
        id: member.userId,
        name: member.userName,
      },
      {
        secret,
        expiresIn: '10h',
      },
    );
  }
}
