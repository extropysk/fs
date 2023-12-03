import { BaseDto } from 'src/db/dto/base.dto'
import { File } from 'src/files/interfaces/file.interface'

export class FileDto extends BaseDto implements File {
  metadata: {
    userId?: string
    isPublic?: boolean
  }
  filename: string
  uploadDate: Date
  length: number
  chunkSize?: number
}
