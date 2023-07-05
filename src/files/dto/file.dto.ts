import { IsNumber, IsOptional, IsString } from 'class-validator'
import { File } from 'src/files/interfaces/file.interface'

export class FileDto implements File {
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
