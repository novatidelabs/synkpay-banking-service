import { Injectable } from '@nestjs/common'
import { SDKFinanceClient } from '@novatide/sdk-finance-wrapper'
import { RedisTokenService } from '../../redis/redis.token.service'
import type { CreateCurrencyParams, UpdateCurrencyParams, CurrencyViewParams } from '@novatide/sdk-finance-wrapper'
import axios from 'axios'

interface ErrorResponse {
  status: number
  data: unknown
}

interface AuthenticatedClient {
  banking: {
    getCurrencies: () => Promise<unknown>
    createCurrency: (params: CreateCurrencyParams) => Promise<unknown>
    getCurrenciesView: (params: CurrencyViewParams) => Promise<unknown>
    updateCurrency: (currencyId: string, params: Partial<UpdateCurrencyParams>) => Promise<unknown>
    setMainCurrency: (currencyId: string) => Promise<unknown>
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

  public async getCurrencies(callerId: string, authorization?: string): Promise<ServiceResult<unknown>> {
    const token = authorization
      ? authorization.replace(/^Bearer\s+/i, '').trim()
      : (await this.redisToken.getTokens(callerId)).sdkFinanceAccessToken

    const authenticated = this.sdkFinanceClient.createAuthenticatedClient(token) as unknown as AuthenticatedClient
    try {
      return await authenticated.banking.getCurrencies()
    } catch (err: unknown) {
      // If the wrapper throws (Axios error), surface the SDK response
      if (axios.isAxiosError(err) && err.response) {
        console.error('[SDK ERROR]', err.response.status, err.response.data)

        const errorResponse: ErrorResponse = {
          status: err.response.status,
          data: err.response.data,
        }
        return errorResponse
      }
      // Otherwise rethrow so Nest logs it
      throw err
    }
  }

  public async createCurrency(
    callerId: string,
    params: CreateCurrencyParams,
    authorization?: string,
  ): Promise<ServiceResult<unknown>> {
    const token = authorization
      ? authorization.replace(/^Bearer\s+/i, '').trim()
      : (await this.redisToken.getTokens(callerId)).sdkFinanceAccessToken

    const authenticated = this.sdkFinanceClient.createAuthenticatedClient(token) as unknown as AuthenticatedClient
    try {
      return await authenticated.banking.createCurrency(params)
    } catch (err: unknown) {
      // If the wrapper throws (Axios error), surface the SDK response
      if (axios.isAxiosError(err) && err.response) {
        console.error('[SDK ERROR]', err.response.status, err.response.data)

        const errorResponse: ErrorResponse = {
          status: err.response.status,
          data: err.response.data,
        }
        return errorResponse
      }
      // Otherwise rethrow so Nest logs it
      throw err
    }
  }

  public async getCurrenciesView(
    callerId: string,
    params: CurrencyViewParams,
    authorization?: string,
  ): Promise<ServiceResult<unknown>> {
    const token = authorization
      ? authorization.replace(/^Bearer\s+/i, '').trim()
      : (await this.redisToken.getTokens(callerId)).sdkFinanceAccessToken

    const authenticated = this.sdkFinanceClient.createAuthenticatedClient(token) as unknown as AuthenticatedClient
    try {
      return await authenticated.banking.getCurrenciesView(params)
    } catch (err: unknown) {
      // If the wrapper throws (Axios error), surface the SDK response
      if (axios.isAxiosError(err) && err.response) {
        console.error('[SDK ERROR]', err.response.status, err.response.data)

        const errorResponse: ErrorResponse = {
          status: err.response.status,
          data: err.response.data,
        }
        return errorResponse
      }
      // Otherwise rethrow so Nest logs it
      throw err
    }
  }

  public async updateCurrency(
    callerId: string,
    currencyId: string,
    params: Partial<UpdateCurrencyParams>,
    authorization?: string,
  ): Promise<ServiceResult<unknown>> {
    const token = authorization
      ? authorization.replace(/^Bearer\s+/i, '').trim()
      : (await this.redisToken.getTokens(callerId)).sdkFinanceAccessToken

    const authenticated = this.sdkFinanceClient.createAuthenticatedClient(token) as unknown as AuthenticatedClient
    try {
      return await authenticated.banking.updateCurrency(currencyId, params)
    } catch (err: unknown) {
      // If the wrapper throws (Axios error), surface the SDK response
      if (axios.isAxiosError(err) && err.response) {
        console.error('[SDK ERROR]', err.response.status, err.response.data)

        const errorResponse: ErrorResponse = {
          status: err.response.status,
          data: err.response.data,
        }
        return errorResponse
      }
      // Otherwise rethrow so Nest logs it
      throw err
    }
  }

  public async setMainCurrency(
    callerId: string,
    currencyId: string,
    authorization?: string,
  ): Promise<ServiceResult<unknown>> {
    const token = authorization
      ? authorization.replace(/^Bearer\s+/i, '').trim()
      : (await this.redisToken.getTokens(callerId)).sdkFinanceAccessToken

    const authenticated = this.sdkFinanceClient.createAuthenticatedClient(token) as unknown as AuthenticatedClient
    try {
      return await authenticated.banking.setMainCurrency(currencyId)
    } catch (err: unknown) {
      // If the wrapper throws (Axios error), surface the SDK response
      if (axios.isAxiosError(err) && err.response) {
        console.error('[SDK ERROR]', err.response.status, err.response.data)

        const errorResponse: ErrorResponse = {
          status: err.response.status,
          data: err.response.data,
        }
        return errorResponse
      }
      // Otherwise rethrow so Nest logs it
      throw err
    }
  }
}
