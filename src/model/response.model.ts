import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { ResponseModelType } from 'src/type/common';

export class ResponseModel<T = undefined> {
  @Exclude() private readonly _message?: string;
  @Exclude() private readonly _statusCode?: HttpStatus;
  @Exclude() private readonly _data?: T;

  constructor(obj?: ResponseModelType<T>) {
    if (obj === undefined) {
      this._message = '성공';
      this._statusCode = HttpStatus.OK;
    } else {
      this._message = obj.message ?? '성공';
      this._statusCode = obj.statusCode ?? HttpStatus.OK;
      this._data = obj.data;
    }
  }

  @Expose()
  get message() {
    return this._message;
  }

  @Expose()
  get statusCode() {
    return this._statusCode;
  }

  @Expose()
  get data() {
    return this._data;
  }

  static JSON<T = undefined>(obj?: ResponseModelType<T>) {
    return new ResponseModel<T>(obj);
  }
}

export class BaseResponse {
  @ApiProperty({
    default: '성공',
  })
  message: string;

  @ApiProperty({
    default: HttpStatus.OK,
  })
  statusCode: HttpStatus;
}
