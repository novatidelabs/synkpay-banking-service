import { Injectable } from "@nestjs/common";
import { SDKFinanceClient } from "@novatide/sdk-finance-wrapper";
import { RedisTokenService } from "../../redis/redis.token.service";
import type {
  CreateCurrencyParams,
  UpdateCurrencyParams,
  CurrencyViewParams,
} from "@novatide/sdk-finance-wrapper";
import axios from "axios";

@Injectable()
export class CurrenciesManagementService {
  constructor(
    private readonly sdkFinanceClient: SDKFinanceClient,
    private readonly redisToken: RedisTokenService,
  ) {}

  private async sdkFinanceAuthenticated(callerId: string) {
    const { sdkFinanceAccessToken } = await this.redisToken.getTokens(callerId);
    return this.sdkFinanceClient.createAuthenticatedClient(
      sdkFinanceAccessToken,
    );
  }

  private async withAuthenticated<T>(
    callerId: string,
    fn: (
      authenticated: Awaited<
        ReturnType<SDKFinanceClient["createAuthenticatedClient"]>
      >,
    ) => Promise<T> | T,
  ): Promise<T> {
    const authenticated = await this.sdkFinanceAuthenticated(callerId);
    return fn(authenticated);
  }

  // ---- Currency management ----

  public async getCurrencies(callerId: string, authorization?: string) {
    const token = authorization
      ? authorization.replace(/^Bearer\s+/i, "").trim()
      : (await this.redisToken.getTokens(callerId)).sdkFinanceAccessToken;

    const authenticated =
      this.sdkFinanceClient.createAuthenticatedClient(token);
    try {
      return await authenticated.banking.getCurrencies();
    } catch (err: any) {
      // If the wrapper throws (Axios error), surface the SDK response
      if (axios.isAxiosError(err) && err.response) {
        console.error("[SDK ERROR]", err.response.status, err.response.data);

        return { status: err.response.status, data: err.response.data };
      }
      // Otherwise rethrow so Nest logs it
      throw err;
    }
  }

  public async createCurrency(
    callerId: string,
    params: CreateCurrencyParams,
    authorization?: string,
  ) {
    const token = authorization
      ? authorization.replace(/^Bearer\s+/i, "").trim()
      : (await this.redisToken.getTokens(callerId)).sdkFinanceAccessToken;

    const authenticated =
      this.sdkFinanceClient.createAuthenticatedClient(token);
    try {
      return await authenticated.banking.createCurrency(params);
    } catch (err: any) {
      // If the wrapper throws (Axios error), surface the SDK response
      if (axios.isAxiosError(err) && err.response) {
        console.error("[SDK ERROR]", err.response.status, err.response.data);

        return { status: err.response.status, data: err.response.data };
      }
      // Otherwise rethrow so Nest logs it
      throw err;
    }
  }

  public async getCurrenciesView(
    callerId: string,
    params: CurrencyViewParams,
    authorization?: string,
  ) {
    const token = authorization
      ? authorization.replace(/^Bearer\s+/i, "").trim()
      : (await this.redisToken.getTokens(callerId)).sdkFinanceAccessToken;

    const authenticated =
      this.sdkFinanceClient.createAuthenticatedClient(token);
    try {
      return await authenticated.banking.getCurrenciesView(params);
    } catch (err: any) {
      // If the wrapper throws (Axios error), surface the SDK response
      if (axios.isAxiosError(err) && err.response) {
        console.error("[SDK ERROR]", err.response.status, err.response.data);

        return { status: err.response.status, data: err.response.data };
      }
      // Otherwise rethrow so Nest logs it
      throw err;
    }
  }

  public async updateCurrency(
    callerId: string,
    currencyId: string,
    params: Partial<UpdateCurrencyParams>,
    authorization?: string,
  ) {
    const token = authorization
      ? authorization.replace(/^Bearer\s+/i, "").trim()
      : (await this.redisToken.getTokens(callerId)).sdkFinanceAccessToken;

    const authenticated =
      this.sdkFinanceClient.createAuthenticatedClient(token);
    try {
      return await authenticated.banking.updateCurrency(currencyId, params);
    } catch (err: any) {
      // If the wrapper throws (Axios error), surface the SDK response
      if (axios.isAxiosError(err) && err.response) {
        console.error("[SDK ERROR]", err.response.status, err.response.data);

        return { status: err.response.status, data: err.response.data };
      }
      // Otherwise rethrow so Nest logs it
      throw err;
    }
  }

  public async setMainCurrency(
    callerId: string,
    currencyId: string,
    authorization?: string,
  ) {
    const token = authorization
      ? authorization.replace(/^Bearer\s+/i, "").trim()
      : (await this.redisToken.getTokens(callerId)).sdkFinanceAccessToken;

    const authenticated =
      this.sdkFinanceClient.createAuthenticatedClient(token);
    try {
      return await authenticated.banking.setMainCurrency(currencyId);
    } catch (err: any) {
      // If the wrapper throws (Axios error), surface the SDK response
      if (axios.isAxiosError(err) && err.response) {
        console.error("[SDK ERROR]", err.response.status, err.response.data);

        return { status: err.response.status, data: err.response.data };
      }
      // Otherwise rethrow so Nest logs it
      throw err;
    }
  }
}
