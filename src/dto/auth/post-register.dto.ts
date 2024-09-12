import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class AuthRegisterDto {
  @ApiProperty()
  @IsEmail()
  userId: string;

  @ApiProperty()
  @IsString()
  pwd: string;

  @ApiProperty()
  @IsString()
  userName: string;
}
