import { BaseDto } from 'src/db/dto/base.dto'

class MetadataDto {
  userId?: string
  isPublic?: boolean
}

export class FileDto extends BaseDto {
  metadata: MetadataDto
  filename: string
  uploadDate: Date
  length: number
  chunkSize?: number
}
