import { OmitType } from '@nestjs/swagger';
import { TodoModel } from 'src/entity/todo.entity';

export class TodoPostDto extends OmitType(TodoModel, [
  'uuid',
  'isExec',
  'isDel',
  'createAt',
  'updateAt',
]) {}

export class TodoPatchDto extends OmitType(TodoModel, [
  'uuid',
  'isDel',
  'createAt',
  'updateAt',
]) {}
