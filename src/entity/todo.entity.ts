import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { MemberModel } from './member.entity';
import { IsBoolean, IsDate, IsString } from 'class-validator';

@Entity({
  name: 'todo',
  comment: 'todo 목록',
})
export class TodoModel {
  @PrimaryColumn({
    type: 'uuid',
  })
  @ApiProperty({
    format: 'uuid',
  })
  uuid: string;

  @ManyToOne(() => MemberModel, (model) => model.todos)
  @JoinColumn()
  member: MemberModel;

  @Column({
    length: 50,
  })
  @ApiProperty({
    description: '실행 제목',
  })
  @IsString()
  title: string;

  @Column({
    type: 'text',
  })
  @ApiProperty({
    description: '실행 할 내용',
  })
  @IsString()
  content: string;

  @Column({
    type: 'date',
  })
  @ApiProperty({
    description: '실행 날짜',
    format: 'date',
  })
  @IsDate()
  todoDate: Date;

  @Column({
    type: 'time',
  })
  @ApiProperty({
    description: '실행 시간',
    example: '18:24',
  })
  @IsString()
  todoTime: string;

  @Column({
    type: 'boolean',
    default: false,
  })
  @ApiPropertyOptional({
    description: '실행 여부',
    default: false,
  })
  @IsBoolean()
  isExec: boolean;

  @Column({
    type: 'boolean',
    default: false,
  })
  @ApiPropertyOptional({
    description: '삭제 여부',
    default: false,
  })
  @IsBoolean()
  isDel: boolean;

  @CreateDateColumn()
  @ApiPropertyOptional({
    description: '생성 년월일',
    format: 'date-time',
  })
  createAt: Date;

  @UpdateDateColumn()
  @ApiPropertyOptional({
    description: '수정 년월일',
    format: 'date-time',
  })
  updateAt: Date;
}
