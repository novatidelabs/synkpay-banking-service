/* npm imports */
import { Injectable } from "@nestjs/common";
import { UnauthorizedException } from "@nestjs/common";
import {
  SessionValue,
  RefreshValue,
} from "../banking/interfaces/service.interface";

/* local imports */
import { RedisService } from "./redis.service";
import { LoggerService } from "../logging/logger.service";

@Injectable()
export class RedisTokenService {
  constructor(
    private readonly redisService: RedisService,
    private readonly logger: LoggerService,
  ) {}

  private getKey(userId: string, type: "access" | "refresh") {
    return `auth:session:${userId}:${type}`;
  }

  public async getTokens(userId: string): Promise<{
    sdkFinanceAccessToken: string;
    sdkFinanceRefreshToken: string;
  }> {
    const accessRaw = await this.redisService.getValue(
      this.getKey(userId, "access"),
    );
    const refreshRaw = await this.redisService.getValue(
      this.getKey(userId, "refresh"),
    );

    if (!accessRaw || !refreshRaw) {
      this.logger.error(`Tokens not found for the user id ${userId}`);
      throw new UnauthorizedException("Tokens not found");
    }

    const session = JSON.parse(accessRaw) as SessionValue;
    const refresh = JSON.parse(refreshRaw) as RefreshValue;

    return {
      sdkFinanceAccessToken: session.sdkFinanceToken,
      sdkFinanceRefreshToken: refresh.sdkFinanceRefreshToken,
    };
  }

  public async clearTokens(userId: string) {
    await Promise.all([
      this.redisService.deleteValue(this.getKey(userId, "access")),
      this.redisService.deleteValue(this.getKey(userId, "refresh")),
    ]);
  }
}
