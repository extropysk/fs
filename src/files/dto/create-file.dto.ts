import { IsEnum, IsOptional } from 'class-validator'

enum Bool {
  TRUE = 'true',
  FALSE = 'false',
}

export class CreateFileDto {
  @IsEnum(Bool)
  @IsOptional()
  public?: Bool = Bool.FALSE

  get isPublic() {
    return this.public === Bool.TRUE
  }
}
