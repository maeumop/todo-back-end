import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { OrderBy, TodoOrder } from 'src/common/enum.constant';

export class TodoListSearchDto {
  @ApiPropertyOptional({
    description: '제목',
  })
  title?: string;

  @ApiPropertyOptional({
    description: '내용',
  })
  content?: string;

  @ApiPropertyOptional({
    description: '검색 시작일',
  })
  startDate?: string;

  @ApiPropertyOptional({
    description: '검색 종료일',
  })
  endDate?: string;
}

export class TodoGetListDto {
  @ApiPropertyOptional({
    description: '목록 마지막 uid',
  })
  lastUid?: string;

  @ApiPropertyOptional({
    description: '페이지 당 불러 오는 수량',
    default: 20,
  })
  pageSize: number = 20;

  @ApiPropertyOptional({
    type: TodoOrder,
    default: TodoOrder.DATE,
  })
  orderTarget: TodoOrder = TodoOrder.CREATE;

  @ApiPropertyOptional({
    type: OrderBy,
    default: OrderBy.DESC,
  })
  orderBy: OrderBy = OrderBy.DESC;

  @ApiPropertyOptional({
    description: '페이지 검색 옵션 그룹',
    type: TodoListSearchDto,
  })
  search?: TodoListSearchDto;
}
