/* npm imports */
import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Query,
  Param,
  Res,
  Headers,
  Req,
} from "@nestjs/common";
import type { Response, Request } from "express";

/* local imports */
import { CurrenciesManagementService } from "../services/currency-management.service";
import {
  CreateCurrencyDto,
  UpdateCurrencyDto,
  CurrencyViewDto,
} from "../dtos/currency-management.dto";

@Controller("v1/currencies")
export class CurrenciesManagementController {
  constructor(
    private readonly currenciesManagementService: CurrenciesManagementService,
  ) {}

  @Get()
  public async getCurrencies(
    @Query("callerId") callerId: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const authorization = req.headers.authorization;
    const result = await this.currenciesManagementService.getCurrencies(
      callerId,
      authorization,
    );
    if (!result)
      return res.status(403).json({ error: "Could not get currencies" });
    const { status, data } = result;
    return res
      .status(status)
      .json(data ?? { message: "Unknown error from SDK Finance" });
  }

  @Post()
  public async createCurrency(
    @Query("callerId") callerId: string,
    //@Headers('authorization') authorization: string | undefined,
    @Body() body: CreateCurrencyDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const authorization = req.headers.authorization;
    const result = await this.currenciesManagementService.createCurrency(
      callerId,
      body,
      authorization,
    );
    if (!result)
      return res.status(403).json({ error: "Could not create currency" });
    const { status, data } = result;
    if (status !== 200 || !data)
      return res
        .status(status)
        .json(data ?? { message: "Unknown error from SDK Finance" });
    return res.status(status).json(data);
  }

  @Post("view")
  public async getCurrenciesView(
    @Query("callerId") callerId: string,
    @Body() filterOptions: CurrencyViewDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const authorization = req.headers.authorization;
    const result = await this.currenciesManagementService.getCurrenciesView(
      callerId,
      filterOptions,
      authorization,
    );
    if (!result)
      return res.status(403).json({ error: "Could not get currencies view" });
    const { status, data } = result;
    return res.status(status).json(data);
  }

  @Patch(":currencyId")
  public async updateCurrency(
    @Param("currencyId") currencyId: string,
    @Query("callerId") callerId: string,
    @Body() body: UpdateCurrencyDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const authorization = req.headers.authorization;
    const result = await this.currenciesManagementService.updateCurrency(
      callerId,
      currencyId,
      body,
      authorization,
    );
    if (!result)
      return res.status(403).json({ error: "Could not update currency" });
    const { status, data } = result;
    if (status !== 200 || !data)
      return res.status(status).json({ message: "Could not update currency" });
    return res.status(status).json(data);
  }

  @Patch(":currencyId/set-main")
  public async setMainCurrency(
    @Param("currencyId") currencyId: string,
    @Query("callerId") callerId: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const authorization = req.headers.authorization;
    const result = await this.currenciesManagementService.setMainCurrency(
      callerId,
      currencyId,
      authorization,
    );
    if (!result)
      return res.status(403).json({ error: "Could not set main currency" });
    const { status, data } = result;
    return res.status(status).json(data);
  }
}
