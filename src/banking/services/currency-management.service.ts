import { Injectable } from '@nestjs/common'
import { SDKFinanceClient } from '@novatide/sdk-finance-wrapper'
import { RedisTokenService } from '../../redis/redis.token.service'
import type {
  CreateCurrencyParams,
  UpdateCurrencyParams,
  CurrencyViewParams,
} from '@novatide/sdk-finance-wrapper'

@Injectable()
export class CurrenciesManagementService {
  constructor(
    private readonly sdkFinanceClient: SDKFinanceClient,
    private readonly redisToken: RedisTokenService,
  ) {}

  private async sdkFinanceAuthenticated(callerId: string) {
    const { sdkFinanceAccessToken } = await this.redisToken.getTokens(callerId)
    return this.sdkFinanceClient.createAuthenticatedClient(sdkFinanceAccessToken)
  }

  private async withAuthenticated<T>(
    callerId: string,
    fn: (authenticated: Awaited<ReturnType<SDKFinanceClient['createAuthenticatedClient']>>) => Promise<T> | T,
  ): Promise<T> {
    const authenticated = await this.sdkFinanceAuthenticated(callerId)
    return fn(authenticated)
  }

  // ---- Currency management ----

  public getCurrencies(callerId: string) {
    return this.withAuthenticated(callerId, (auth) => auth.banking.getCurrencies())
  }

  public createCurrency(callerId: string, params: CreateCurrencyParams) {
    return this.withAuthenticated(callerId, (auth) => auth.banking.createCurrency(params))
  }

  public getCurrenciesView(callerId: string, params: CurrencyViewParams) {
    return this.withAuthenticated(callerId, (auth) => auth.banking.getCurrenciesView(params))
  }

  public updateCurrency(callerId: string, currencyId: string, params: Partial<UpdateCurrencyParams>) {
    return this.withAuthenticated(callerId, (auth) => auth.banking.updateCurrency(currencyId, params))
  }

  public setMainCurrency(callerId: string, currencyId: string) {
    return this.withAuthenticated(callerId, (auth) => auth.banking.setMainCurrency(currencyId))
  }
}
