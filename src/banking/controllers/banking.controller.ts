/* npm imports */
import { Controller, Get } from '@nestjs/common'

/* local imports */
import { BankingService } from '../services/banking.service'

@Controller('banking')
export class BankingController {
  constructor(private readonly bankingService: BankingService) {}

  @Get('ping')
  ping() {
    return this.bankingService.ping()
  }
}
