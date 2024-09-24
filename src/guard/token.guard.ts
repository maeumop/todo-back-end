import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthService } from 'src/api/auth/auth.service';
import { MemberService } from 'src/api/member/member.service';
import { PUBLIC_API_KEY } from 'src/decorator/public-api.decorator';

function getToken(
  headers: any,
  service: AuthService,
  isBasic: boolean = false,
) {
  const rawToken = headers['authorization'];

  if (!rawToken) {
    throw new UnauthorizedException(
      `${isBasic ? 'Basic' : 'Bearer'} token이 없습니다.`,
    );
  }

  return service.getOnlyToken(rawToken, isBasic);
}

@Injectable()
export class BasicTokenGuard implements CanActivate {
  constructor(
    private readonly authSvc: AuthService,
    private readonly memberSvc: MemberService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();

    const token = getToken(req.headers, this.authSvc, true);
    const { userId, pwd } = this.authSvc.decodeBasicToken(token);
    const member = await this.memberSvc.member(pwd).byId(userId).user();

    req.member = member;

    return true;
  }
}

@Injectable()
export class AccessTokenGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly authSvc: AuthService,
    private readonly memberSvc: MemberService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride(PUBLIC_API_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const req = context.switchToHttp().getRequest();

    if (!isPublic) {
      const token = getToken(req.headers, this.authSvc);
      const { id } = this.authSvc.verifyToken(token);
      const member = await this.memberSvc.member().byId(id).user();
      req.token = token;
      req.member = member;
    }

    req.isPublic = isPublic;

    return true;
  }
}
