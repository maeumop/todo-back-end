import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { MemberModel } from 'src/entity/member.entity';
import { FindOneOptions, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { sha512 } from 'js-sha512';
import { MemberUpdateDto } from 'src/dto/member/member-update.dto';

@Injectable()
export class MemberService {
  private options: FindOneOptions<MemberModel> = {};
  private sha512Key?: string;

  constructor(
    @InjectRepository(MemberModel)
    private readonly repository: Repository<MemberModel>,
    private readonly config: ConfigService,
  ) {
    this.sha512Key = this.config.get('SHA512_KEY');
  }

  member(password?: string) {
    if (password !== undefined) {
      const pwd = sha512.hmac(this.sha512Key, password);
      this.options = {
        where: {
          pwd,
        },
      };
    }

    return this;
  }

  byId(userId: string) {
    this.options = {
      where: {
        ...this.options.where,
        userId,
      },
    };

    return this;
  }

  byIdx(idx: number) {
    this.options = {
      where: {
        ...this.options,
        idx,
      },
    };

    return this;
  }

  async exists(): Promise<boolean> {
    return await this.repository.exists(this.options);
  }

  async user(): Promise<MemberModel> {
    const member = await this.repository.findOne(this.options);
    this.options = {};
    return member;
  }

  async updateMember(idx: number, dto: MemberUpdateDto) {
    const result = await this.repository.update(idx, dto);
    return result.affected > 0;
  }
}
