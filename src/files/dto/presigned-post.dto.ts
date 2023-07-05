import { PresignedPost } from '@aws-sdk/s3-presigned-post'

export class PresignedPostDto implements PresignedPost {
  url: string
  fields: Record<string, string>
}
