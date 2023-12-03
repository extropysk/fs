import { BaseDto } from 'src/db/dto/base.dto'

export class FileMetadataDto {
  userId?: string
  isPublic?: boolean
}

export class FileDto extends BaseDto {
  metadata: FileMetadataDto
  filename: string
  uploadDate: Date
  length: number
  chunkSize?: number
  publicUrl?: string
}
