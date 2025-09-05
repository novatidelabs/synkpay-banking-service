/* npm imports */
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ConfigService } from '@nestjs/config'

/* local imports */
import { ConfigKey } from './config/enum'
import { LoggerService } from './logging/logger.service'

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule)

    const configService = app.get(ConfigService)
    const port = configService.get<number>(ConfigKey.PORT, 6000)
    const logger = new LoggerService(configService)
  
    await app.listen(port)
  
    logger.log(`🚀 Banking service running on http://localhost:${port}/`)
} catch (error) {
  if (error instanceof Error) console.error('Error during bootstrap:', error.message)
  else console.error('Error during bootstrap:', error)

  process.exit(1)
}
}
void bootstrap()
