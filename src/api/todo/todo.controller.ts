import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UseInterceptors,
} from '@nestjs/common';
import { TodoService } from './todo.service';
import {
  ApiBody,
  ApiOperation,
  ApiProperty,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { TodoGetListDto } from 'src/dto/todo/todo-paginate.dto';
import { BaseResponse, ResponseModel } from 'src/model/response.model';
import { RequestWithMember } from 'src/type/common';
import {
  TodoDetailItemModel,
  TodoListResponse,
  TodoPostResponse,
} from 'src/model/todo/todo.response.model';
import { TodoPatchDto, TodoPostDto } from 'src/dto/todo/post-register.dto';
import { PublicApi } from 'src/decorator/public-api.decorator';

@Controller('todo')
@ApiTags('TODO')
export class TodoController {
  constructor(private readonly todoSvc: TodoService) {}

  @Get()
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOperation({
    description: 'To Do 목록 호출',
  })
  @ApiProperty({
    description: '',
    type: TodoGetListDto,
  })
  @ApiResponse({
    description: '목록 호출 성공',
    type: TodoListResponse,
  })
  async getTodoList(
    @Query() query: TodoGetListDto,
    @Request() req: RequestWithMember,
  ) {
    const response = this.todoSvc.getTodoList(query, req.member.idx);
    return response;
  }

  @Get(':uuid')
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOperation({
    description: 'To do 상세 내용',
  })
  @ApiResponse({
    description: '상세 내용 호출 성공',
    type: TodoDetailItemModel,
  })
  async getTodo(
    @Param('uuid') uuid: string,
    @Request() req: RequestWithMember,
  ) {
    return await this.todoSvc.getTodoDetail(uuid, req.member.idx);
  }

  @Post()
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOperation({
    description: 'To to 등록',
  })
  @ApiBody({
    type: TodoPostDto,
  })
  @ApiResponse({
    description: '등록 성공',
    type: TodoPostResponse,
  })
  async postTodo(@Body() body: TodoPostDto, @Request() req: RequestWithMember) {
    const response = await this.todoSvc.insertTodo(body, req.member.idx);
    return response;
  }

  @Patch(':uuid')
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOperation({
    description: 'Todo 상세 내용 수정',
  })
  @ApiBody({
    type: TodoPatchDto,
  })
  @ApiResponse({
    description: '수정 성공',
    type: BaseResponse,
  })
  async patchTodo(
    @Param('uuid') uuid: string,
    @Body() body: TodoPatchDto,
    @Request() req: RequestWithMember,
  ) {
    const response = await this.todoSvc.updateTodo(uuid, body, req.member.idx);
    return response;
  }

  @Delete(':uuid')
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOperation({
    description: 'To do 항목 삭제',
  })
  @ApiResponse({
    description: '삭제 성공',
    type: BaseResponse,
  })
  async deleteTodo(
    @Param('uuid') uuid: string,
    @Request() req: RequestWithMember,
  ) {
    const response = await this.todoSvc.deleteTodo(uuid, req.member.idx);
    return response;
  }

  @Get('/makeList')
  @PublicApi()
  async makeList() {
    await this.todoSvc.makeManyList();
    return ResponseModel.JSON();
  }
}
