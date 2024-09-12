import { ApiProperty, OmitType } from '@nestjs/swagger';
import { TodoModel } from 'src/entity/todo.entity';
import { BaseResponse } from '../response.model';

export class TodoItemModel extends OmitType(TodoModel, [
  'content',
  'isDel',
  'createAt',
  'updateAt',
]) {}

export class TodoDetailItemModel extends OmitType(TodoModel, [
  'createAt',
  'isDel',
]) {}

export class TodoListModel {
  @ApiProperty({
    type: [TodoItemModel],
  })
  items: TodoItemModel[];

  @ApiProperty()
  count: number;
}

export class TodoListResponse extends BaseResponse {
  @ApiProperty({
    type: TodoListModel,
  })
  data: TodoListModel;
}

export class TodoPostResponse extends BaseResponse {
  @ApiProperty({
    type: TodoItemModel,
  })
  data: TodoItemModel;
}
