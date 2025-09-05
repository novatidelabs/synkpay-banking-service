import { Injectable } from '@nestjs/common'
import { SDKFinanceClient } from '@novatide/sdk-finance-wrapper'
import { RedisTokenService } from '../../redis/redis.token.service'
import type { CreateCurrencyParams, UpdateCurrencyParams, CurrencyViewParams } from '@novatide/sdk-finance-wrapper'
import type { 
  CurrencyListResponseDto, 
  CurrencyResponseDto, 
  CurrencyViewResponseDto 
} from '../dtos/currency-management.dto'
import axios from 'axios'

interface ErrorResponse {
  status: number
  data: unknown
}

interface AuthenticatedClient {
  banking: {
    getCurrencies: () => Promise<CurrencyListResponseDto>
    createCurrency: (params: CreateCurrencyParams) => Promise<CurrencyResponseDto>
    getCurrenciesView: (params: CurrencyViewParams) => Promise<CurrencyViewResponseDto>
    updateCurrency: (currencyId: string, params: Partial<UpdateCurrencyParams>) => Promise<CurrencyResponseDto>
    setMainCurrency: (currencyId: string) => Promise<CurrencyResponseDto>
  }
}

type ServiceResult<T> = T | ErrorResponse

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

  public async getCurrencies(callerId: string) {
    return this.withAuthenticated(callerId, (authenticated) => authenticated.banking.getCurrencies());
  }

  public async createCurrency(callerId: string, params: CreateCurrencyParams){
    return this.withAuthenticated(callerId, (authenticated) => authenticated.banking.createCurrency(params));
  }
  

  public getCurrenciesView(callerId: string, params: CurrencyViewParams) {
    return this.withAuthenticated(callerId, (authenticated) => authenticated.banking.getCurrenciesView(params));
  }

  public async updateCurrency(
    callerId: string,
    currencyId: string,
    params: Partial<UpdateCurrencyParams>
  ){
    return this.withAuthenticated(callerId, (authenticated) => authenticated.banking.updateCurrency(currencyId, params));
  }

   public async setMainCurrency(
    callerId: string,
    currencyId: string,
  ) {
    return this.withAuthenticated(callerId, (authenticated) => authenticated.banking.setMainCurrency(currencyId));
  }
}
