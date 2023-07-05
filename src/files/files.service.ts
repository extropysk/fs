import { DeleteObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { PresignedPost, createPresignedPost } from '@aws-sdk/s3-presigned-post'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Payload } from 'src/core/interfaces/payload.interface'
import { File } from 'src/files/interfaces/file.interface'

@Injectable()
export class FilesService {
  s3: S3Client
  bucket: string

  constructor(private configService: ConfigService) {
    this.s3 = new S3Client({ region: configService.get<string>('REGION') })
    this.bucket = configService.get<string>('BUCKET')
  }

  async create(file: File, current: Payload): Promise<PresignedPost> {
    return await createPresignedPost(this.s3, {
      Bucket: this.bucket,
      Key: `${current.sub}/${file.name}`,
      Conditions: [
        ['content-length-range', 0, 1048576], // up to 1 MB
        { acl: 'public-read' },
      ],
      Fields: {
        acl: 'public-read',
        'Content-Type': file.type,
      },
      Expires: 60, //Seconds before the presigned post expires. 3600 by default.
    })
  }

  async delete(key: string) {
    await this.s3.send(
      new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: key,
      })
    )
  }
}
