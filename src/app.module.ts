import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { WinstonModule, utilities as nestWinstonModuleUtilities } from 'nest-winston'
import { FilesModule } from 'src/files/files.module'
import * as winston from 'winston'

@Module({
  imports: [
    FilesModule,
    ConfigModule.forRoot({ isGlobal: true }),
    JwtModule.register({ global: true }),
    WinstonModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        return {
          transports: [
            new winston.transports.Console({
              format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.ms(),
                nestWinstonModuleUtilities.format.nestLike(process.env.npm_package_name, {
                  colors: true,
                  prettyPrint: true,
                })
              ),
            }),
          ],
        }
      },
      inject: [ConfigService],
    }),
  ],
})
export class AppModule {}
