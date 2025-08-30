/* npm imports */
import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";

/* local imports */
import { CurrenciesManagementController } from "./controllers/currency-management.controller";
import { CurrenciesManagementService } from "./services/currency-management.service";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { HttpModule } from "@nestjs/axios";
import { LoggerModule } from "../logging/logger.module";
import { RedisModule } from "../redis/redis.module";
import { SDKFinanceModule } from "@novatide/sdk-finance-wrapper";
import { RedisTokenService } from "../redis/redis.token.service";
import { InternalAuthMiddleware } from "./middlewares/internal-auth.middleware";

@Module({
  imports: [
    ConfigModule,
    HttpModule,
    LoggerModule,
    RedisModule,
    SDKFinanceModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const baseUrl = configService.get<string>("SDK_FINANCE_BASE_URL");
        if (!baseUrl) {
          throw new Error(
            "SDK_FINANCE_BASE_URL is not defined in configuration",
          );
        }

        return { baseUrl };
      },
    }),
  ],
  controllers: [CurrenciesManagementController],
  providers: [CurrenciesManagementService, RedisTokenService],
})
export class BankingModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    {
      consumer
        .apply(InternalAuthMiddleware)
        .forRoutes(CurrenciesManagementController);
    }
  }
}
