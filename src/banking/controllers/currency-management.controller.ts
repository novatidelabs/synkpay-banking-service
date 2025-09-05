/* npm imports */
import { Body, Controller, Get, Patch, Post, Query, Param, Res, Headers, Req } from '@nestjs/common'
import type { Response, Request } from 'express'

/* local imports */
import { CurrenciesManagementService } from '../services/currency-management.service'
import { CreateCurrencyDto, UpdateCurrencyDto, CurrencyViewDto } from '../dtos/currency-management.dto'

interface ErrorResponse {
  status: number
  data: unknown
}

function isErrorResponse(result: unknown): result is ErrorResponse {
  return typeof result === 'object' && result !== null && 'status' in result && 'data' in result
}

@Controller('v1')
export class CurrenciesManagementController {
  constructor(private readonly currenciesManagementService: CurrenciesManagementService) {}

  @Get('currencies')
  public async getCurrencies(@Query('callerId') callerId: string, @Res() res: Response) {
    const result = await this.currenciesManagementService.getCurrencies(callerId)
    if (!result) return res.status(403).json({ error: 'Could not get currencies' })

    if (isErrorResponse(result)) {
      return res.status(result.status).json(result.data ?? { message: 'Unknown error from SDK Finance' })
    }

    // If it's not an error response, it's the actual data
    return res.status(200).json(result)
  }

  @Post('currencies')
  public async createCurrency(
    @Query('callerId') callerId: string,
    @Body() body: CreateCurrencyDto,
    @Res() res: Response,
  ) {
    const result = await this.currenciesManagementService.createCurrency(callerId, body)
    if (!result) return res.status(403).json({ error: 'Could not create currency' })

    if (isErrorResponse(result)) {
      return res.status(result.status).json(result.data ?? { message: 'Unknown error from SDK Finance' })
    }

    // If it's not an error response, it's the actual data
    return res.status(200).json(result)
  }

  @Post('currencies/view')
  public async getCurrenciesView(
    @Query('callerId') callerId: string,
    @Body() filterOptions: CurrencyViewDto,
    @Res() res: Response,
  ) {
    const result = await this.currenciesManagementService.getCurrenciesView(callerId, filterOptions)
    if (!result) return res.status(403).json({ error: 'Could not get currencies view' })

    if (isErrorResponse(result)) {
      return res.status(result.status).json(result.data)
    }

    // If it's not an error response, it's the actual data
    return res.status(200).json(result)
  }

  @Patch('currencies/:currencyId')
  public async updateCurrency(
    @Param('currencyId') currencyId: string,
    @Query('callerId') callerId: string,
    @Body() body: UpdateCurrencyDto,
    @Res() res: Response,
  ) {
    const result = await this.currenciesManagementService.updateCurrency(callerId, currencyId, body)
    if (!result) return res.status(403).json({ error: 'Could not update currency' })

    if (isErrorResponse(result)) {
      return res.status(result.status).json(result.data ?? { message: 'Could not update currency' })
    }

    // If it's not an error response, it's the actual data
    return res.status(200).json(result)
  }

  @Patch('currencies/:currencyId/set-main')
  public async setMainCurrency(
    @Param('currencyId') currencyId: string,
    @Query('callerId') callerId: string,
    @Res() res: Response,
  ) {
    const result = await this.currenciesManagementService.setMainCurrency(callerId, currencyId)
    if (!result) return res.status(403).json({ error: 'Could not set main currency' })

    if (isErrorResponse(result)) {
      return res.status(result.status).json(result.data)
    }

    // If it's not an error response, it's the actual data
    return res.status(200).json(result)
  }
}
