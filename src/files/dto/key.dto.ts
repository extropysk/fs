import { IsString } from 'class-validator'

export class KeyDto {
  @IsString()
  key: string

  get sub() {
    return this.key.split('/')[0]
  }
}
