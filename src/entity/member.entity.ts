import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { TodoModel } from './todo.entity';

@Entity({
  name: 'member',
  comment: '회원 정보',
})
export class MemberModel {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  idx: number;

  @Column({
    length: 100,
  })
  @ApiProperty({
    description: '회원 아이디 - email',
  })
  userId: string;

  @Column({
    length: 30,
  })
  @ApiProperty({
    description: '회원 명',
  })
  userName: string;

  @Column({
    length: 128,
  })
  @Exclude({
    toPlainOnly: true,
  })
  pwd: string;

  @CreateDateColumn()
  @ApiProperty()
  createAt: Date;

  @UpdateDateColumn()
  @ApiProperty()
  updateAt: Date;

  @OneToMany(() => TodoModel, (model) => model.member)
  todos: TodoModel;
}
