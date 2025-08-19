/* npm imports */
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { HttpModule } from "@nestjs/axios";

/* local imports */
import { BankingModule } from "./banking/banking.module";
import { HealthController } from "./health/health.controller";
import config from "./config/config";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [config] }),
    HttpModule,
    BankingModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
