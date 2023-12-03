import { IsNumber, IsOptional, IsString } from 'class-validator'

export class SignFileDto {
  @IsString()
  name: string

  @IsString()
  type: string

  @IsNumber()
  @IsOptional()
  size?: number

  @IsNumber()
  @IsOptional()
  lastModified?: number
}
