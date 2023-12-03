import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  ParseFilePipe,
  Post,
  StreamableFile,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger'
import { Current } from 'src/core/decorators/current.decorator'
import { Jwt } from 'src/core/decorators/jwt.decorator'
import { Payload } from 'src/core/interfaces/payload.interface'
import { BaseDto } from 'src/db/dto/base.dto'
import { DeleteResultDto } from 'src/db/dto/delete-result.dto'
import { IdDto } from 'src/db/dto/id.dto'
import { CreateFileDto } from 'src/files/dto/create-file.dto'
import { FileDto } from 'src/files/dto/file.dto'
import { PresignedPostDto } from 'src/files/dto/presigned-post.dto'
import { SignFileDto } from 'src/files/dto/sign-file.dto'
import { FilesService } from 'src/files/files.service'

@ApiTags('files')
@Controller('files')
@Jwt()
export class FilesController {
  constructor(private filesService: FilesService) {}

  @ApiOperation({ summary: 'Create presigned post url' })
  @ApiOkResponse({ type: PresignedPostDto })
  @Post('sign')
  async sign(@Body() file: SignFileDto, @Current() current: Payload) {
    return await this.filesService.sign(file, current)
  }

  @ApiOperation({ summary: 'Insert file' })
  @ApiCreatedResponse({ type: BaseDto })
  @UseInterceptors(FileInterceptor('file'))
  @Post()
  async insert(
    @UploadedFile(
      new ParseFilePipe({
        validators: [],
      })
    )
    file: Express.Multer.File,
    @Current() current: Payload,
    @Body() data: CreateFileDto
  ) {
    if (!file) {
      throw new BadRequestException()
    }

    return await this.filesService.insert(file, current, data)
  }

  @ApiOperation({ summary: 'Get file' })
  @ApiOkResponse({ type: StreamableFile })
  @Get(':id')
  async findOne(@Param() params: IdDto) {
    const file = await this.filesService.findOne(params.id)
    if (!file) {
      throw new NotFoundException()
    }

    return new StreamableFile(file)
  }

  @ApiOperation({ summary: 'Get metadata' })
  @ApiOkResponse({ type: FileDto })
  @Get(':id/metadata')
  async findOneMetadata(@Param() params: IdDto) {
    const data = await this.filesService.findOneMetadata(params.id)
    if (!data) {
      throw new NotFoundException()
    }

    return data
  }

  @ApiOperation({ summary: 'Delete file' })
  @ApiOkResponse({ type: DeleteResultDto })
  @Delete(':id')
  async delete(@Param() params: IdDto, @Current() current: Payload) {
    const file = await this.filesService.findOneMetadata(params.id)
    if (!file) {
      throw new NotFoundException()
    }

    if (file.metadata.userId?.toString() !== current.sub.toString()) {
      throw new ForbiddenException()
    }

    return await this.filesService.delete(params.id)
  }
}
