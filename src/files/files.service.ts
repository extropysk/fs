import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3'
import { PresignedPost, createPresignedPost } from '@aws-sdk/s3-presigned-post'
import { Inject, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Db, ObjectId } from 'mongodb'
import { Payload } from 'src/core/interfaces/payload.interface'
import { DATABASE } from 'src/db/database.module'
import { BaseDto } from 'src/db/dto/base.dto'
import { CreateFileDto } from 'src/files/dto/create-file.dto'
import { FileDto } from 'src/files/dto/file.dto'
import { SignFileDto } from 'src/files/dto/sign-file.dto'

const COLLECTION = 'files'

@Injectable()
export class FilesService {
  s3: S3Client
  bucket: string

  constructor(
    @Inject(DATABASE)
    private db: Db,
    private configService: ConfigService
  ) {
    this.s3 = new S3Client({ region: configService.get<string>('REGION') })
    this.bucket = configService.get<string>('BUCKET')
  }

  async sign(file: SignFileDto, current: Payload): Promise<PresignedPost> {
    const doc: FileDto = {
      filename: file.name,
      uploadDate: new Date(),
      length: file.size,
      metadata: {
        userId: current.sub,
        isPublic: true,
      },
      _id: undefined,
    }

    const { insertedId: _id } = await this.db.collection<FileDto>(COLLECTION).insertOne(doc)
    return await createPresignedPost(this.s3, {
      Bucket: this.bucket,
      Key: _id.toString(),
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

  async findOneMetadata(id: ObjectId): Promise<FileDto> {
    return await this.db.collection<FileDto>(COLLECTION).findOne({ _id: id })
  }

  streamToFile = (stream): Promise<Buffer> =>
    new Promise((resolve, reject) => {
      const chunks = []
      stream.on('data', (chunk) => chunks.push(chunk))
      stream.on('error', reject)
      stream.on('end', () => resolve(Buffer.concat(chunks)))
    })

  async findOne(id: ObjectId): Promise<Buffer> {
    const file = await this.findOneMetadata(id)
    if (!file) {
      return null
    }

    const data = await this.s3.send(
      new GetObjectCommand({
        Bucket: this.bucket,
        Key: file._id.toString(),
      })
    )
    return await this.streamToFile(data.Body)
  }

  async insert(file: Express.Multer.File, current: Payload, data: CreateFileDto): Promise<BaseDto> {
    const doc: FileDto = {
      filename: file.originalname,
      uploadDate: new Date(),
      length: file.size,
      metadata: {
        userId: current.sub,
        isPublic: data.isPublic,
      },
      _id: undefined,
    }

    const { insertedId: _id } = await this.db.collection<FileDto>(COLLECTION).insertOne(doc)

    await this.s3.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: _id.toString(),
        Body: file.buffer,
        // ACL: isPublic ? ObjectCannedACL.public_read : undefined,
      })
    )
    return { _id }
  }

  async delete(id: ObjectId) {
    await this.s3.send(
      new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: id.toString(),
      })
    )
    return await this.db.collection<FileDto>(COLLECTION).deleteOne({ _id: id })
  }
}
