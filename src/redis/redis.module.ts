/* npm imports */
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

/* local imports */
import { RedisService } from './redis.service'

@Module({
  imports: [ConfigModule],
  providers: [RedisService],
  exports: [RedisService],
})
export class RedisModule {}
