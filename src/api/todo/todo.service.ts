import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderBy } from 'src/common/enum.constant';
import { TodoPatchDto, TodoPostDto } from 'src/dto/todo/post-register.dto';
import { TodoGetListDto } from 'src/dto/todo/todo-paginate.dto';
import { TodoModel } from 'src/entity/todo.entity';
import { ResponseModel } from 'src/model/response.model';
import {
  TodoDetailItemModel,
  TodoItemModel,
  TodoListModel,
} from 'src/model/todo/todo.response.model';
import {
  FindManyOptions,
  FindOptionsOrder,
  FindOptionsWhere,
  LessThan,
  Like,
  Repository,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(TodoModel)
    private readonly repository: Repository<TodoModel>,
  ) {}

  /**
   * 등록
   * @param dto
   * @param idx
   * @returns
   */
  async insertTodo(dto: TodoPostDto, idx: number) {
    const todo = await this.repository.save({
      uuid: uuidv4(),
      member: { idx },
      ...dto,
    });

    const { uuid, title, isExec, todoDate, todoTime } = todo;

    return ResponseModel.JSON<TodoItemModel>({
      data: { uuid, title, isExec, todoDate, todoTime } as TodoItemModel,
    });
  }

  /**
   * 목록
   * @param dto
   * @returns
   */
  async getTodoList(dto: TodoGetListDto, idx: number) {
    console.log(idx);
    const order: FindOptionsOrder<TodoModel> = {
      createAt: OrderBy.DESC,
    };
    const where: FindOptionsWhere<TodoModel> = {};
    const take: number = dto.take ?? 20;
    const skip: number = 0;

    if (dto.orderTarget) {
      order.createAt = undefined;
      order[`${dto.orderTarget}`] = dto.orderType ?? OrderBy.DESC;
    }

    if (dto.search) {
      for (const key in dto.search) {
        where[key] = Like(dto.search[key]);
      }
    }

    const options: FindManyOptions<TodoModel> = {
      select: {
        uuid: true,
        title: true,
        todoDate: true,
        todoTime: true,
        isExec: true,
        updateAt: true,
      },
      where: null,
      order,
      take,
      skip,
    };

    if (dto.lastUid) {
      const item = await this.repository.findOne({
        where: {
          uuid: dto.lastUid,
          member: { idx },
        },
      });

      if (item) {
        options.where = {
          createAt: LessThan<Date>(item.createAt),
          ...where,
        };
      }
    }

    const [items, count] = await this.repository.findAndCount(options);

    const data = { items, count };

    return ResponseModel.JSON<TodoListModel>({ data });
  }

  /**
   * 상세 내용
   * @param uuid
   * @param idx
   * @returns
   */
  async getTodoDetail(uuid: string, idx: number) {
    const data = await this.repository.findOne({
      select: [
        'uuid',
        'title',
        'content',
        'todoDate',
        'todoTime',
        'isExec',
        'updateAt',
      ],
      where: {
        uuid,
        member: { idx },
      },
    });

    return ResponseModel.JSON<TodoDetailItemModel>({ data });
  }

  /**
   * Todo 상세 내용 수정
   * @param uuid
   * @param dto
   * @param idx
   */
  async updateTodo(uuid: string, dto: TodoPatchDto, idx: number) {
    const result = await this.repository.update(
      {
        uuid,
        member: { idx },
      },
      {
        title: dto.title,
        content: dto.content,
        isExec: dto.isExec,
        todoDate: dto.todoDate,
        todoTime: dto.todoTime,
      },
    );

    return ResponseModel.JSON({
      message: result.affected > 0 ? '성공' : '수정 실패',
    });
  }

  /**
   * Todo 삭제
   * @param uuid
   * @param idx
   * @returns
   */
  async deleteTodo(uuid: string, idx: number) {
    const result = await this.repository.delete({
      uuid,
      member: { idx },
    });

    return ResponseModel.JSON({
      message: result.affected > 0 ? '성공' : '삭제 실패',
    });
  }

  async makeManyList() {
    for (let i = 0; i < 100; i++) {
      await this.repository.insert({
        uuid: uuidv4(),
        title: `할일 목록을 자동으로 만들었습니다. ${i}`,
        content: `할일 내용은\n그냥 막 넣습니다.\n${i}`,
        todoDate: '2024-09-10',
        todoTime: '11:22',
      });
    }

    return ResponseModel.JSON();
  }
}
