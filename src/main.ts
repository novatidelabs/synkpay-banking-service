/* npm imports */
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ConfigService } from '@nestjs/config'

/* local imports */
import { ConfigKey } from './config/enum'
import { LoggerService } from './logging/logger.service'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.setGlobalPrefix('api')

  const configService = app.get(ConfigService)
  const port = configService.get<number>(ConfigKey.PORT, 6000)
  const logger = new LoggerService(configService)

  await app.listen(port)

  logger.log(`🚀 Banking service running on http://localhost:${port}`)
}

void bootstrap()
