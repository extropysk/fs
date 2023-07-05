import { Module } from '@nestjs/common'
import { FilesController } from 'src/files/files.controller'
import { FilesService } from 'src/files/files.service'

@Module({
  providers: [FilesService],
  controllers: [FilesController],
  exports: [FilesService],
})
export class FilesModule {}
