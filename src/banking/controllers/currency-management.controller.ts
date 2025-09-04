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

@Controller('v1/currencies')
export class CurrenciesManagementController {
  constructor(private readonly currenciesManagementService: CurrenciesManagementService) {}

  @Get()
  public async getCurrencies(@Query('callerId') callerId: string, @Req() req: Request, @Res() res: Response) {
    const authorization = req.headers.authorization
    const result = await this.currenciesManagementService.getCurrencies(callerId, authorization)
    if (!result) return res.status(403).json({ error: 'Could not get currencies' })

    if (isErrorResponse(result)) {
      return res.status(result.status).json(result.data ?? { message: 'Unknown error from SDK Finance' })
    }

    // If it's not an error response, it's the actual data
    return res.status(200).json(result)
  }

  @Post()
  public async createCurrency(
    @Query('callerId') callerId: string,
    //@Headers('authorization') authorization: string | undefined,
    @Body() body: CreateCurrencyDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const authorization = req.headers.authorization
    const result = await this.currenciesManagementService.createCurrency(callerId, body, authorization)
    if (!result) return res.status(403).json({ error: 'Could not create currency' })

    if (isErrorResponse(result)) {
      return res.status(result.status).json(result.data ?? { message: 'Unknown error from SDK Finance' })
    }

    // If it's not an error response, it's the actual data
    return res.status(200).json(result)
  }

  @Post('view')
  public async getCurrenciesView(
    @Query('callerId') callerId: string,
    @Body() filterOptions: CurrencyViewDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const authorization = req.headers.authorization
    const result = await this.currenciesManagementService.getCurrenciesView(callerId, filterOptions, authorization)
    if (!result) return res.status(403).json({ error: 'Could not get currencies view' })

    if (isErrorResponse(result)) {
      return res.status(result.status).json(result.data)
    }

    // If it's not an error response, it's the actual data
    return res.status(200).json(result)
  }

  @Patch(':currencyId')
  public async updateCurrency(
    @Param('currencyId') currencyId: string,
    @Query('callerId') callerId: string,
    @Body() body: UpdateCurrencyDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const authorization = req.headers.authorization
    const result = await this.currenciesManagementService.updateCurrency(callerId, currencyId, body, authorization)
    if (!result) return res.status(403).json({ error: 'Could not update currency' })

    if (isErrorResponse(result)) {
      return res.status(result.status).json(result.data ?? { message: 'Could not update currency' })
    }

    // If it's not an error response, it's the actual data
    return res.status(200).json(result)
  }

  @Patch(':currencyId/set-main')
  public async setMainCurrency(
    @Param('currencyId') currencyId: string,
    @Query('callerId') callerId: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const authorization = req.headers.authorization
    const result = await this.currenciesManagementService.setMainCurrency(callerId, currencyId, authorization)
    if (!result) return res.status(403).json({ error: 'Could not set main currency' })

    if (isErrorResponse(result)) {
      return res.status(result.status).json(result.data)
    }

    // If it's not an error response, it's the actual data
    return res.status(200).json(result)
  }
}
