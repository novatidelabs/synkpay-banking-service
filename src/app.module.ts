/* npm imports */
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { HttpModule } from "@nestjs/axios";
import { APP_FILTER } from "@nestjs/core";

/* local imports */
import { BankingModule } from "./banking/banking.module";
import { AppController } from "./app.controller";
import config from "./config/config";
import { LoggerModule } from "./logging/logger.module";
import { LoggerService } from "./logging/logger.service";
import { GlobalExceptionFilter } from "./common/global.exception.filter";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [config] }),
    HttpModule,
    BankingModule,
    LoggerModule,
  ],
  controllers: [AppController],
  providers: [
    LoggerService,
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
  ],
  exports: [LoggerService],
})
export class AppModule {}
