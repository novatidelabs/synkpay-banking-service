/* npm imports */
import { Body, Controller, Get, Patch, Post, Query, Param, Res } from '@nestjs/common'
import type { Response } from 'express'

/* local imports */
import { CurrenciesManagementService } from '../services/currency-management.service'
import { CreateCurrencyDto, UpdateCurrencyDto, CurrencyViewDto } from '../dtos/currency-management.dto'

@Controller('v1/currencies')
export class CurrenciesManagementController {
  constructor(private readonly currenciesManagementService: CurrenciesManagementService) {}

  @Get()
  public async getCurrencies(@Query('callerId') callerId: string, @Res() res: Response) {
    const result = await this.currenciesManagementService.getCurrencies(callerId)
    if (!result) return res.status(403).json({ error: 'Could not get currencies' })
    const { status, data } = result
    return res.status(status).json(data)
  }

  @Post()
  public async createCurrency(
    @Query('callerId') callerId: string,
    @Body() body: CreateCurrencyDto,
    @Res() res: Response,
  ) {
    const result = await this.currenciesManagementService.createCurrency(callerId, body)
    if (!result) return res.status(403).json({ error: 'Could not create currency' })
    const { status, data } = result
    if (status !== 200 || !data) return res.status(status).json({ message: 'Could not create currency' })
    return res.status(status).json(data)
  }

  @Post('view')
  public async getCurrenciesView(
    @Query('callerId') callerId: string,
    @Body() filterOptions: CurrencyViewDto,
    @Res() res: Response,
  ) {
    const result = await this.currenciesManagementService.getCurrenciesView(callerId, filterOptions)
    if (!result) return res.status(403).json({ error: 'Could not get currencies view' })
    const { status, data } = result
    return res.status(status).json(data)
  }

  @Patch(':currencyId')
  public async updateCurrency(
    @Param('currencyId') currencyId: string,
    @Query('callerId') callerId: string,
    @Body() body: UpdateCurrencyDto,
    @Res() res: Response,
  ) {
    const result = await this.currenciesManagementService.updateCurrency(callerId, currencyId, body)
    if (!result) return res.status(403).json({ error: 'Could not update currency' })
    const { status, data } = result
    if (status !== 200 || !data) return res.status(status).json({ message: 'Could not update currency' })
    return res.status(status).json(data)
  }

  @Patch(':currencyId/set-main')
  public async setMainCurrency(
    @Param('currencyId') currencyId: string,
    @Query('callerId') callerId: string,
    @Res() res: Response,
  ) {
    const result = await this.currenciesManagementService.setMainCurrency(callerId, currencyId)
    if (!result) return res.status(403).json({ error: 'Could not set main currency' })
    const { status, data } = result
    return res.status(status).json(data)
  }
}
