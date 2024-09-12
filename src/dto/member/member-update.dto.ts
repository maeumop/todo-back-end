import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class MemberUpdateDto {
  @ApiPropertyOptional({ nullable: true })
  @IsOptional()
  @IsString()
  pwd?: string;

  @ApiPropertyOptional({ nullable: true })
  @IsOptional()
  @IsString()
  userName?: string;
}

export class ChangePasswordDto {
  @ApiProperty()
  @IsString()
  pwd: string;
}
