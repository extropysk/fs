import { Base } from 'src/db/interfaces/base.interface'

export interface File extends Base {
  metadata: {
    userId?: string
    isPublic?: boolean
  }
  filename: string
  uploadDate: Date
  length: number
  chunkSize?: number
}
