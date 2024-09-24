import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
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
  @IsOptional()
  @IsString()
  lastUid?: string;

  @ApiPropertyOptional({
    description: '페이지 당 불러 오는 수량',
    default: 20,
  })
  @IsOptional()
  @IsString()
  take?: number;

  @ApiPropertyOptional({
    type: TodoOrder,
    default: TodoOrder.DATE,
  })
  orderTarget?: TodoOrder;

  @ApiPropertyOptional({
    type: OrderBy,
    default: OrderBy.DESC,
  })
  @IsOptional()
  @IsString()
  orderType?: OrderBy;

  @ApiPropertyOptional({
    description: '페이지 검색 옵션 그룹',
    type: TodoListSearchDto,
  })
  @IsOptional()
  @IsString()
  search?: TodoListSearchDto;
}
