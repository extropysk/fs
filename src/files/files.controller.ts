import { Body, Controller, Delete, ForbiddenException, Post, Query } from '@nestjs/common'
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger'
import { Current } from 'src/core/decorators/current.decorator'
import { Jwt } from 'src/core/decorators/jwt.decorator'
import { Payload } from 'src/core/interfaces/payload.interface'
import { EmptyDto } from 'src/files/dto/empty.dto'
import { FileDto } from 'src/files/dto/file.dto'
import { KeyDto } from 'src/files/dto/key.dto'
import { PresignedPostDto } from 'src/files/dto/presigned-post.dto'
import { FilesService } from 'src/files/files.service'

@ApiTags('files')
@Controller('files')
@Jwt()
export class FilesController {
  constructor(private filesService: FilesService) {}

  @ApiOperation({ summary: 'Create presigned post url' })
  @ApiOkResponse({ type: PresignedPostDto })
  @Post()
  async create(@Body() file: FileDto, @Current() current: Payload) {
    return await this.filesService.create(file, current)
  }

  @ApiOperation({ summary: 'Delete file' })
  @ApiOkResponse({ type: EmptyDto })
  @Delete()
  async delete(@Query() query: KeyDto, @Current() current: Payload) {
    if (query.sub !== current.sub) {
      throw new ForbiddenException()
    }

    await this.filesService.delete(query.key)
    return {}
  }
}
