import { ApiProperty } from '@nestjs/swagger'
import { ObjectId } from 'mongodb'

export class BaseDto {
  @ApiProperty({
    type: String,
  })
  _id: ObjectId
}
