import { Module } from '@nestjs/common'
import { DatabaseModule } from 'src/db/database.module'
import { FilesController } from 'src/files/files.controller'
import { FilesService } from 'src/files/files.service'

@Module({
  providers: [FilesService],
  controllers: [FilesController],
  imports: [DatabaseModule],
  exports: [FilesService],
})
export class FilesModule {}
